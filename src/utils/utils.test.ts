import {
    DateUnit,
    EnvironmentVariable,
    formatDayDate,
    formatWeekDate,
    getWeekNumber,
    isEnvVarSet,
    resolveFileDateFormatPath,
    resolveHomePath,
    validateExistingEnvVar
} from "./utils";
import {DateTime} from "luxon";
import {MissingConfigurationException} from "../Exceptions/MissingConfigurationException";

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

    describe("checkIfFileExists", () => {
        it("should return true if the provided file path is a valid file", () => {
            // Mock file
            jest.mock('fs');

            // // @ts-expect-error the fs API doesn't expect existsSync to be mutated, but we need it to mock
            // fs.existsSync = jest.fn();
            // // @ts-expect-error we are temporary overriding the implementation to mock the response.
            // fs.existsSync.mockReturnValue(false);


        })

        it("should throw an error if the provided file path does not exist", () => {
            // Mock file

        })

        it("should throw if the provided file path is a directory", () => {
            // Mock file

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

    // const VALID_OBSIDIAN_VAULT_NAME = "Personal";
    // const VALID_DAILY_PATH = "/Users/ekluw/Projects/obsidian/Personal/999-Planner/DailyPlans";
    // const VALID_TEMPLATE_PATH = "~/Projects/obsidian/Personal/999-Templates/daily plan template.md";
    //
    // const OLD_ENV = process.env;
    //
    // beforeEach(() => {
    //     jest.resetModules(); // Most important - it clears the cache
    //     process.env = { ...OLD_ENV }; // Make a copy
    // });
    //
    // afterAll(() => {
    //     process.env = OLD_ENV; // Restore old environment
    // });})
})
