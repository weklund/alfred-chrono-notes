import path from "path"
import * as fs from "fs"
import * as os from "os"

import {FileProvider} from "./FileProvider.js"
import {InvalidFilePathSchemaException} from "../../Exceptions/InvalidFilePathSchemaException.js"
import {FileDoesNotExistException} from "../../Exceptions/FileDoesNotExistException.js"
import {PathNotFileException} from "../../Exceptions/PathNotFileException.js"
import {FatalReadFileSyncException} from "../../Exceptions/FatalReadFileSyncException.js"
import {FileAlreadyExistsException} from "../../Exceptions/FileAlreadyExistsException.js"
import {FatalWriteFileSyncException} from "../../Exceptions/FatalWriteFileSyncException.js"

jest.mock("fs")
jest.mock("path")
jest.mock("os")

describe("FileProvider", () => {
    let fileProvider: FileProvider

    const existsSyncMock = fs.existsSync as jest.Mock
    const statSyncMock = fs.statSync as jest.Mock
    const readFileSyncMock = fs.readFileSync as jest.Mock
    const writeFileSyncMock = fs.writeFileSync as jest.Mock
    const pathMock = path as jest.Mocked<typeof path>
    const osMock = os as jest.Mocked<typeof os>

    const expectedHomeDirectory = "/user/bob"
    const testUserInfo: os.UserInfo<string> = {
        gid: 1111,
        homedir: expectedHomeDirectory,
        shell: "/bin/sh",
        uid: 1111,
        username: "XXXXXXXX",
    }

    beforeEach(() => {
        // Reset all mocks before each test
        jest.resetAllMocks()
        jest.resetModules()

        // Setup FileProvider instance
        fileProvider = new FileProvider()

        // Reset process.env to a known state before each test
        process.env = {}
    })

    describe("resolveNoteFullPath", () => {
        it('should return the full path to a note with the correct date format', () => {
            // Setup
            const testHomePath = '/user/home';
            process.env.HOME = testHomePath;
            const directoryPath = '~/notes'
            const expectedAbsolutePath = '/user/home/notes'

            const formattedDate = '2023-01-01'
            const expectedPath = `${testHomePath}/notes/${formattedDate}`
            const expectedNoteFullPath = `${expectedPath}.md`

            pathMock.join
                .mockReturnValueOnce(expectedAbsolutePath)
                .mockReturnValueOnce(expectedPath)

            // Execute
            const actualResult = fileProvider.resolveNoteFullPath(directoryPath, formattedDate)

            // Verify
            expect(actualResult).toBe(expectedNoteFullPath)

            // TODO: Avoid referencing unbound methods which may cause unintentional scoping of `this`.
            // If your function does not access `this`, you can annotate it with `this: void`, or consider using an arrow function instead.
            // (@typescript-eslint/unbound-method)
            // eslint-disable-next-line @typescript-eslint/unbound-method
            expect(pathMock.join).toHaveBeenCalledTimes(2)
        })
    })

    describe("resolveHomePath", () => {
        it('should the file path when absolute path given', () => {
            const absolutePath = '/Users/testuser/test.txt';

            const actualResult = fileProvider.resolveHomePath(absolutePath)
            expect(actualResult).toBe(absolutePath)
        })
    })

    describe("isValidPathSchema", () => {

        describe("has valid path cases", () => {
            it('should return true if path with subdirectories', () => {
                // Setup
                osMock.userInfo
                    .mockReturnValueOnce(testUserInfo)
                const path = `${expectedHomeDirectory}/data/input.txt`

                // Verify
                expect(fileProvider.isValidPathSchema(path)).toBeTruthy()
            });

            it('should return true if path is root and file', () => {
                // Setup
                osMock.userInfo
                    .mockReturnValueOnce(testUserInfo)
                const path = `${expectedHomeDirectory}/archive.input.txt`

                // Verify
                expect(fileProvider.isValidPathSchema(path)).toBeTruthy()
            });

        })


        describe("has invalid path cases", () => {
            it('should return true if file name without path', () => {
                // Setup
                osMock.userInfo
                    .mockReturnValueOnce(testUserInfo)
                const path = 'file.txt'

                // Verify
                expect(fileProvider.isValidPathSchema(path)).toBeFalsy()
            });

            it('should return false if path starts with a dot', () => {
                // Setup
                osMock.userInfo
                    .mockReturnValueOnce(testUserInfo)
                const path = './config.json'

                // Verify
                expect(fileProvider.isValidPathSchema(path)).toBeFalsy()
            });

            it('should return false if path starts with double dots', () => {
                // Setup
                osMock.userInfo
                    .mockReturnValueOnce(testUserInfo)
                const path = '../config.json'

                // Verify
                expect(fileProvider.isValidPathSchema(path)).toBeFalsy()
            });

            it('should return false if path has backwards slashes', () => {
                // Setup
                osMock.userInfo
                    .mockReturnValueOnce(testUserInfo)

                const path = 'user\\data\\input.txt'

                // Verify
                expect(fileProvider.isValidPathSchema(path)).toBeFalsy()
            });

            it('should return false if path has illegal characters', () => {
                // Setup
                osMock.userInfo
                    .mockReturnValueOnce(testUserInfo)
                const path = 'user/data/input<>.txt'

                // Verify
                expect(fileProvider.isValidPathSchema(path)).toBeFalsy()
            });

            it('should return false if path has absolute path only', () => {
                // Setup
                osMock.userInfo
                    .mockReturnValueOnce(testUserInfo)
                const path = '/etc/passwd'

                // Verify
                expect(fileProvider.isValidPathSchema(path)).toBeFalsy()
            });

            // TODO:  Is this the correct example for null byte?
            it('should return false if path has null byte injection', () => {
                // Setup
                osMock.userInfo
                    .mockReturnValueOnce(testUserInfo)
                const path = 'user/data\0script.js'

                // Verify
                expect(fileProvider.isValidPathSchema(path)).toBeFalsy()
            });

            it('should return false if path has empty string', () => {
                // Setup
                osMock.userInfo
                    .mockReturnValueOnce(testUserInfo)
                const path = ''

                // Verify
                expect(fileProvider.isValidPathSchema(path)).toBeFalsy()
            });

            it('should return false if path has only special characters', () => {
                // Setup
                osMock.userInfo
                    .mockReturnValueOnce(testUserInfo)
                const path = '***********'

                // Verify
                expect(fileProvider.isValidPathSchema(path)).toBeFalsy()
            });

        })
    })

    describe('doesFileExist', () => {
        it('should return true if the file exists', () => {
            // Setup
            const testFilePath = '/path/to/file/that/exists.md'

            existsSyncMock.mockReturnValue(true)
            statSyncMock.mockReturnValue({isFile: jest.fn().mockReturnValue(true)})

            // Execute
            const actualResult = fileProvider.doesFileExist(testFilePath)
            // Verify
            expect(actualResult).toBeTruthy()
        })

        it('should return false if the file does not exist', () => {
            // Setup
            const testFilePath = '/path/to/file.md'

            existsSyncMock.mockReturnValue(false)
            statSyncMock.mockReturnValue({isFile: jest.fn().mockReturnValue(false)})

            // Execute
            const actualResult = fileProvider.doesFileExist(testFilePath)

            // Verify
            expect(actualResult).toBeFalsy()
        })

        it('should return false if the file path is a directory', () => {
            // Setup
            const testFilePath = '/path/to/file.md'

            existsSyncMock.mockReturnValue(true)
            statSyncMock.mockReturnValue({isFile: jest.fn().mockReturnValue(false)})

            // Execute
            const actualResult = fileProvider.doesFileExist(testFilePath)

            // Verify
            expect(actualResult).toBeFalsy()
        })
    });

    describe("checkIfFileExists", () => {
        it('should not throw when given filePath that actually has a file', () => {
            // Setup
            const testFilePath = `${testUserInfo.homedir}/testfile.md`

            osMock.userInfo
                .mockReturnValueOnce(testUserInfo)

            // Mock that the given file exists
            existsSyncMock.mockReturnValue(true)

            // Mock that the given file path is a file
            statSyncMock.mockReturnValue({
                isFile: jest.fn()
                    .mockReturnValue(true)
            })

            // Verify
            expect(() => {
                fileProvider.checkIfFileExists(testFilePath)
            }).not.toThrow()
        })

        it('should throw InvalidFilePathSchemaException when given filePath is invalid schema', () => {
            // Setup
            const testFilePath = `testfile.md`

            osMock.userInfo
                .mockReturnValueOnce(testUserInfo)
            existsSyncMock.mockReturnValue(true)
            statSyncMock.mockReturnValue({isFile: jest.fn().mockReturnValue(true)})

            // Verify
            expect(() => {
                fileProvider.checkIfFileExists(testFilePath)
            }).toThrow(InvalidFilePathSchemaException)
        })

        it('should throw FileDoesNotExistException when given filePath does not exist', () => {
            // Setup
            const testFilePath = `${testUserInfo.homedir}/testfile.md`

            osMock.userInfo
                .mockReturnValueOnce(testUserInfo)
            existsSyncMock.mockReturnValue(false)
            statSyncMock.mockReturnValue({isFile: jest.fn().mockReturnValue(false)})

            // Verify
            expect(() => {
                fileProvider.checkIfFileExists(testFilePath)
            }).toThrow(FileDoesNotExistException)
        })

        it('should throw PathNotFileException when given filePath is not a file', () => {
            // Setup
            const testFilePath = `${testUserInfo.homedir}/testfile.md`

            osMock.userInfo
                .mockReturnValueOnce(testUserInfo)
            existsSyncMock.mockReturnValue(true)
            statSyncMock.mockReturnValue({isFile: jest.fn().mockReturnValue(false)})

            // Verify
            expect(() => {
                fileProvider.checkIfFileExists(testFilePath)
            }).toThrow(PathNotFileException)
        })
    })

    describe('readTemplate', () => {
        it('should return the template content when given filePath exists and has content', () => {
            // Setup
            readFileSyncMock.mockReturnValue('template content file path exists')

            // Execute
            const result = fileProvider.readTemplate('abc.txt')

            // Verify
            expect(result).not.toBe('')
        })

        it('should throw Error when can not read the template file', () => {
            // Setup
            readFileSyncMock.mockImplementation(() => {
                // eslint-disable-next-line sonarjs/no-duplicate-string
                throw new Error("Error Message")
            })

            // Verify
            expect(() => {
                fileProvider.readTemplate('abc.txt')
            }).toThrow(FatalReadFileSyncException)
        })
    })

    describe("createTemplatedFile", () => {
        it("should create a file based on an existing template file", () => {
            // Setup
            const testNewFilePath = `${testUserInfo.homedir}/testFile.md`
            const testTemplateFilePath = `${testUserInfo.homedir}/testTemplateFile.md`
            const expectedTemplateContent = 'template content'

            osMock.userInfo
                .mockReturnValueOnce(testUserInfo)

            existsSyncMock
                // Mock that the new file path does not exist
                .mockReturnValueOnce(false)
                // Mock that the given template file path does exist
                .mockReturnValueOnce(true)
            statSyncMock.mockReturnValue({
                    isFile: jest.fn()
                        // Mock that the given template file is a file
                        .mockReturnValueOnce(true)
                })
            readFileSyncMock.mockReturnValue(expectedTemplateContent)

            // Verify
            expect(() => {
                fileProvider.createTemplatedNote(testNewFilePath, testTemplateFilePath)
            }).not.toThrow()

            expect(writeFileSyncMock).toHaveBeenCalledTimes(1)
            expect(writeFileSyncMock).toHaveBeenCalledWith(testNewFilePath, expectedTemplateContent)
        })

        it('should throw FileAlreadyExistsException if a file already exists at the given filePath', () => {
            // Setup
            const testNewFilePath = `${testUserInfo.homedir}/testFile.md`
            const testTemplateFilePath = `${testUserInfo.homedir}/testTemplateFile.md`

            osMock.userInfo
                .mockReturnValueOnce(testUserInfo)

            existsSyncMock
                // Mock that the new file path already is a file
                .mockReturnValueOnce(true)

            statSyncMock.mockReturnValue({
                isFile: jest.fn()
                    // Mock that the given new filePath is a file
                    .mockReturnValueOnce(true)
            })

            // Verify
            expect(() => {
                fileProvider.createTemplatedNote(testNewFilePath, testTemplateFilePath)
            }).toThrow(FileAlreadyExistsException)
        })

        it('should throw FatalReadFileSyncException if the template file can not be read', () => {
            // Setup
            const testNewFilePath = `${testUserInfo.homedir}/testFile.md`
            const testTemplateFilePath = `${testUserInfo.homedir}/testTemplateFile.md`

            osMock.userInfo
                .mockReturnValueOnce(testUserInfo)

            existsSyncMock
                // Mock that the new file path already is a file
                .mockReturnValueOnce(false)
                // Mock that the given template file path does exist
                .mockReturnValueOnce(true)

            statSyncMock.mockReturnValue({
                isFile: jest.fn()
                    // Mock that the given template file is a file
                    .mockReturnValueOnce(true)
            })

            readFileSyncMock.mockImplementation(() => {
                throw new Error("Error Message")
            })

            // Verify
            expect(() => {
                fileProvider.createTemplatedNote(testNewFilePath, testTemplateFilePath)
            }).toThrow(FatalReadFileSyncException)
        })

        it('should throw FatalWriteFileSyncException if the new file can not be created', () => {
            // Setup
            const testNewFilePath = `${testUserInfo.homedir}/testFile.md`
            const testTemplateFilePath = `${testUserInfo.homedir}/testTemplateFile.md`

            osMock.userInfo
                .mockReturnValueOnce(testUserInfo)

            existsSyncMock
                // Mock that the new file path already is a file
                .mockReturnValueOnce(false)
                // Mock that the given template file path does exist
                .mockReturnValueOnce(true)

            statSyncMock.mockReturnValue({
                isFile: jest.fn()
                    // Mock that the given template file is a file
                    .mockReturnValueOnce(true)
            })

            readFileSyncMock.mockReturnValue("template content")

            writeFileSyncMock.mockImplementation(() => {
                throw new Error("Error Message")
            })

            // Verify
            expect(() => {
                fileProvider.createTemplatedNote(testNewFilePath, testTemplateFilePath)
            }).toThrow(FatalWriteFileSyncException)
        })
    })
})