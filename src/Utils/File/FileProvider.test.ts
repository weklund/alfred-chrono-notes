import os from "os"
import {FileProvider} from "./FileProvider"

const fileProvider = new FileProvider()

describe("FileProvider", () => {
    describe("isValidPathSchema", () => {

        const userInfo = os.userInfo()
        const homeDirectory = userInfo.homedir

        describe("has valid path cases", () => {

            it('should return true if path with subdirectories', () => {
                const path = `${homeDirectory}/data/input.txt`
                expect(fileProvider.isValidPathSchema(path)).toBeTruthy()
            });

            it('should return true if path is root and file', () => {
                const path = `${homeDirectory}/archive.input.txt`
                expect(fileProvider.isValidPathSchema(path)).toBeTruthy()
            });

        })


        describe("has invalid path cases", () => {
            it('should return true if file name without path', () => {
                const path = 'file.txt'
                expect(fileProvider.isValidPathSchema(path)).toBeFalsy()
            });

            it('should return false if path starts with a dot', () => {
                const path = './config.json'
                expect(fileProvider.isValidPathSchema(path)).toBeFalsy()
            });

            it('should return false if path starts with double dots', () => {
                const path = '../config.json'
                expect(fileProvider.isValidPathSchema(path)).toBeFalsy()
            });

            it('should return false if path has backwards slashes', () => {
                const path = 'user\\data\\input.txt'
                expect(fileProvider.isValidPathSchema(path)).toBeFalsy()
            });

            it('should return false if path has illegal characters', () => {
                const path = 'user/data/input<>.txt'
                expect(fileProvider.isValidPathSchema(path)).toBeFalsy()
            });

            it('should return false if path has absolute path only', () => {
                const path = '/etc/passwd'
                expect(fileProvider.isValidPathSchema(path)).toBeFalsy()
            });

            // TODO:  Is this the correct example for null byte?
            it('should return false if path has null byte injection', () => {
                const path = 'user/data\0script.js'
                expect(fileProvider.isValidPathSchema(path)).toBeFalsy()
            });

            it('should return false if path has empty string', () => {
                const path = ''
                expect(fileProvider.isValidPathSchema(path)).toBeFalsy()
            });

            it('should return false if path has only special characters', () => {
                const path = '***********'
                expect(fileProvider.isValidPathSchema(path)).toBeFalsy()
            });

        })
    })

    describe("resolveFileDateFormatPath", () => {

        it("should return a file in a 'yyyy-MM-DD cccc' format when formatting daily", () => {
            // Setup
            const expected = "testDirectory/2017-03-12 Sunday.md"
            // Execute
            const actual = fileProvider.resolveNoteFullPath(
                "testDirectory",
                "2017-03-12 Sunday",
            )
            // Verify
            expect(actual).toEqual(expected)
        })

        it("should return a file in a 'YYYY-[W]ww' format when the dateUnit is WEEK", () => {
            // Setup
            const expected = "testDirectory/2017-W11.md"
            // Execute
            const actual = fileProvider.resolveNoteFullPath(
                "testDirectory",
                "2017-W11"
            )
            // Verify
            expect(actual).toEqual(expected)
        })
    })

    describe("createTemplatedFile", () => {
        it("should", () => {

        })
    })
})