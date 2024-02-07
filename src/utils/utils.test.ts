import {
    checkIfFileExists,
    DateUnit,
    EnvironmentVariable,
    formatDayDate,
    formatWeekDate,
    getWeekNumber,
    isEnvVarSet,
    isValidPathSchema,
    resolveFileDateFormatPath,
    resolveHomePath,
    validateExistingEnvVar
} from "./utils";
import {DateTime} from "luxon";
import {MissingConfigurationException} from "../Exceptions/MissingConfigurationException";
import {InvalidFilePathSchemaException} from "../Exceptions/InvalidFilePathSchemaException";
import * as fs from "fs";

const opts = { locale: "en-US" };

describe("Utility Unit Tests", () => {


    describe("formatDayDate", () => {
        const cases = [
            [DateTime.local(2024, 1, 1, opts), "2024-01-01 Monday"],
            [DateTime.local(2024, 1, 7, opts), "2024-01-07 Sunday"],
            [DateTime.local(2024, 1, 27, opts),"2024-01-27 Saturday"],
            [DateTime.local(2024, 1, 29, opts),"2024-01-29 Monday"],
            [DateTime.local(2024, 2, 4, opts), "2024-02-04 Sunday"],
            [DateTime.local(2024, 2, 29, opts), "2024-02-29 Thursday"],
            [DateTime.local(2024, 3, 1, opts),  "2024-03-01 Friday"],
            [DateTime.local(2024, 3, 30, opts), "2024-03-30 Saturday"],
            [DateTime.local(2024, 3, 31, opts), "2024-03-31 Sunday"],
            [DateTime.local(2024, 12, 22, opts), "2024-12-22 Sunday"],
            [DateTime.local(2024, 12, 28, opts), "2024-12-28 Saturday"],
        ];

        test.each(cases)(
            "given %p DateTime, expect %p date string",
            (givenDate, expectedResult) => {
                const result = formatDayDate(givenDate as DateTime);
                expect(result).toEqual(expectedResult);
            }
        );
    })

    describe("formatWeekDate", () => {
        const cases = [
            [DateTime.local(2024, 1, 1, opts),   "2024-W01"],
            [DateTime.local(2024, 2, 4, opts),   "2024-W06"],
            [DateTime.local(2024, 12, 22, opts), "2024-W52"],
            [DateTime.local(2025, 2, 28, opts),  "2025-W09"],
            [DateTime.local(2020, 2, 29, opts),  "2020-W09"],
            [DateTime.local(2024, 3, 30, opts),  "2024-W13"],
        ];

        test.each(cases)(
            "given %p DateTime, expect %p formatted week date string",
            (givenDate, expectedResult) => {
                const result = formatWeekDate(givenDate as DateTime);
                expect(result).toEqual(expectedResult);
            }
        );

    })

    describe("getWeekNumber", () => {
        const cases = [
            [DateTime.local(2024, 1, 1, opts), "Monday", 1],
            [DateTime.local(2024, 1, 7, opts), "Sunday", 2],
            [DateTime.local(2024, 1, 27, opts), "Saturday", 4],
            [DateTime.local(2024, 1, 29, opts), "Monday", 5],
            [DateTime.local(2024, 2, 4, opts), "Sunday", 6],
            [DateTime.local(2024, 2, 29, opts), "Thursday", 9],
            [DateTime.local(2024, 3, 1, opts), "Friday", 9],
            [DateTime.local(2024, 3, 30, opts), "Saturday", 13],
            [DateTime.local(2024, 3, 31, opts), "Sunday", 14],
            [DateTime.local(2024, 12, 22, opts), "Sunday", 52],
            [DateTime.local(2024, 12, 28, opts), "Saturday", 52],
        ];

        test.each(cases)(
            "given %p date, on %p, expect %p week number",
            (givenDate,_,  expectedResult) => {
                const result = getWeekNumber(givenDate as DateTime);
                expect(result).toEqual(expectedResult as number);
            }
        );
    })

    describe("resolveHomePath", () => {
        const originalEnv = process.env;
        const mockOSUser = "CURRENT_MAC_USER"

        beforeEach(() => {
            jest.resetModules();
            process.env = {
                ...originalEnv,
                // This is an Alfred runtime system environment variable.  User doesn't set this.
                HOME: `/Users/${mockOSUser}`,
            };

        })

        afterEach(() => {
            process.env = originalEnv;
        });

        it("should return the absolute path if home path given", () => {
            // Setup
            const expected = `/Users/${mockOSUser}/obsidian-files/my-markdown-file-for-obs.md`
            const testPath = "~/obsidian-files/my-markdown-file-for-obs.md";
            // Execute
            const actual = resolveHomePath(testPath);
            // Verify
            expect(actual).toEqual(expected);
        })

        it("should return the absolute path if absolute path given", () => {
            // Setup
            const expected = `/Users/${mockOSUser}/obsidian-files/my-markdown-file-for-obs.md`
            const testPath = "/Users/CURRENT_MAC_USER/obsidian-files/my-markdown-file-for-obs.md";
            // Execute
            const actual = resolveHomePath(testPath);
            // Verify
            expect(actual).toEqual(expected);
        })
    })

    describe("isValidPathSchema", () => {

        describe("has valid path cases", () => {
            it('should return true if file name without path', () => {

                const path = 'file.txt';

                expect(isValidPathSchema(path)).toBeTruthy()
            });

            it('should return true if path with subdirectories', () => {

                const path = 'user/data/input.txt';

                expect(isValidPathSchema(path)).toBeTruthy()
            });

            it('should return true if path with dots and dashes', () => {

                const path = 'user/data-2023/archive.input.txt';

                expect(isValidPathSchema(path)).toBeTruthy()
            });

        })


        describe("has invalid path cases", () => {
            it('should return false if path starts with a dot', () => {
                const path = './config.json';
                expect(isValidPathSchema(path)).toBeFalsy()
            });

            it('should return false if path starts with double dots', () => {
                const path = '../config.json';
                expect(isValidPathSchema(path)).toBeFalsy()
            });

            it('should return false if path has backwards slashes', () => {
                const path = 'user\\data\\input.txt';
                expect(isValidPathSchema(path)).toBeFalsy()
            });

            it('should return false if path has illegal characters', () => {
                const path = 'user/data/input<>.txt';
                expect(isValidPathSchema(path)).toBeFalsy()
            });

            it('should return false if path has absolute path only', () => {
                const path = '/etc/passwd';
                expect(isValidPathSchema(path)).toBeFalsy()
            });

            // TODO:  Is this the correct example for null byte?
            it('should return false if path has null byte injection', () => {
                const path = 'user/data\0script.js';
                expect(isValidPathSchema(path)).toBeFalsy()
            });

            it('should return false if path has empty string', () => {
                const path = '';
                expect(isValidPathSchema(path)).toBeFalsy()
            });

            it('should return false if path has only special characters', () => {
                const path = '***********';
                expect(isValidPathSchema(path)).toBeFalsy()
            });

        })
    })


    describe("checkIfFileExists", () => {

        // const fsMock = {...fs}
        //
        // jest.mock('fs')
        //
        // // const spy = jest.spyOn(fs, 'existsSync').mockImplementationOnce();
        //
        // beforeEach(() => {
        //     Object.assign(fs, fsMock)
        // })




        // jest.mock('fs', (): Partial<typeof import('fs')> => {
        //     const mockFs = require('memfs').fs;
        //     return {
        //         ...mockFs,
        //         existsSync(path: string) {
        //             if (path.endsWith('.node')) {
        //                 return true;
        //             } else {
        //                 return mockFs.existsSync(path);
        //             }
        //         },
        //     };
        // });


        it("should throw InvalidFilePathSchemaException if the provided file path is not a valid file path schema", () => {

            const BAD_FILE_PATH = ".../<>.txt"

            expect(() => {
                checkIfFileExists(BAD_FILE_PATH)
            }).toThrow(InvalidFilePathSchemaException)
        })

        it("should throw FileDoesNotExistException if the provided file path does not exist", () => {
            // jest.mock('fs', () => {
            //     // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            //     return {
            //         __esModule: true,    //    <----- this __esModule: true is important
            //         ...jest.requireActual('fs')
            //     };
            // });

            jest.createMockFromModule('fs');

            // jest.spyOn(fs, 'existsSync').mockImplementation(() => {
            //     return false
            // });



            // const spy = jest.spyOn(fs, "existsSync").mockReturnValue(true);
            const BAD_FILE_PATH = ".../<>.txt"

            expect(() => {
                checkIfFileExists(BAD_FILE_PATH)
            }).toThrow(InvalidFilePathSchemaException)

            // expect(spy).toHaveBeenCalledTimes(1)
            //
            // spy.mockRestore()
        })

        it("should throw PathNotFileException if the provided file path is a directory", () => {
            // Setup

            // Execute

            // Verify
        })
    })

    describe("doesFileExist", () => {
        it("should", () => {

        })
    })

    describe("validateExistingEnvVar", () => {
        it("should throw MissingConfigurationException when Environment Variable is not set", () => {
            const process_env_NULL_ENV_VAR: EnvironmentVariable = undefined;

            expect(() => {
                validateExistingEnvVar(process_env_NULL_ENV_VAR)
            }).toThrow(MissingConfigurationException)
        })
    })

    describe("isEnvVarSet", () => {
        it("should return true if the provided Environment Variable is set", () => {
            // Setup
            const process_env_TEST_ENV_VAR: EnvironmentVariable = "hello world";
            // Verify
            expect(isEnvVarSet(process_env_TEST_ENV_VAR)).toBeTruthy()
        })

        it("should return false if the provided Environment Variable is undefined", () => {
            // Setup
            const process_env_TEST_ENV_VAR: EnvironmentVariable = undefined;
            // Verify
            expect(isEnvVarSet(process_env_TEST_ENV_VAR)).toBeFalsy()
        })

        it("should return false if the provided Environment Variable is null", () => {
            // Setup
            const process_env_TEST_ENV_VAR: EnvironmentVariable = null;
            // Verify
            expect(isEnvVarSet(process_env_TEST_ENV_VAR)).toBeFalsy()
        })

        it("should return false if the provided Environment Variable is empty string", () => {
            // Setup
            const process_env_TEST_ENV_VAR: EnvironmentVariable = "";
            // Verify
            expect(isEnvVarSet(process_env_TEST_ENV_VAR)).toBeFalsy()
        })
    })

    describe("resolveFileDateFormatPath", () => {
        it("should return a file in a 'YYYY-MM-DD dddd' format when the dateUnit is DAY", () => {
            // Setup
            const date = DateTime.local(2017, 3, 12)
            const expected = "testDirectory/2017-03-12 Sunday.md"
            // Execute
            const actual = resolveFileDateFormatPath(
                "testDirectory",
                date,
                DateUnit.DAY,
                "yyyy-MM-dd cccc"
            )
            // Verify
            expect(actual).toEqual(expected)
        })

        it("should return a file in a 'YYYY-[W]ww' format when the dateUnit is WEEK", () => {
            // Setup
            const date = DateTime.local(2017, 3, 12)
            const expected = "testDirectory/2017-W11.md"
            // Execute
            const actual = resolveFileDateFormatPath(
                "testDirectory",
                date,
                DateUnit.WEEK,
                "yyyy-'W'WW"
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
