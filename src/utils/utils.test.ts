import {formatDayDate, formatWeekDate, getWeekNumber} from "./utils";
import {DateTime} from "luxon";

const opts = { locale: "en-US" };

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
        it("should", () => {

        })
    })

    describe("checkIfFileExists", () => {
        it("should", () => {

        })
    })

    describe("doesFileExist", () => {
        it("should", () => {

        })
    })

    describe("validateExistingEnvVar", () => {
        it("should", () => {

        })
    })

    describe("isEnvVarSet", () => {
        it("should", () => {

        })
    })

    describe("resolveFileDateFormatPath", () => {
        it("should", () => {

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