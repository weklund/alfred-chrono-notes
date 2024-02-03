import {formatDayDate, getWeekNumber} from "./utils";
import {DateTime} from "luxon";

describe("formatDayDate", () => {
    const cases = [
        [DateTime.local(2024, 1, 1), "2024-01-01 Monday"],
        [DateTime.local(2024, 1, 7), "2024-01-07 Sunday"],
        [DateTime.local(2024, 1, 27),"2024-01-27 Saturday"],
        [DateTime.local(2024, 1, 29),"2024-01-29 Monday"],
        [DateTime.local(2024, 2, 4), "2024-02-04 Sunday"],
        [DateTime.local(2024, 2, 29), "2024-02-29 Thursday"],
        [DateTime.local(2024, 3, 1),  "2024-03-01 Friday"],
        [DateTime.local(2024, 3, 30), "2024-03-30 Saturday"],
        [DateTime.local(2024, 3, 31), "2024-03-31 Sunday"],
        [DateTime.local(2024, 12, 22), "2024-12-22 Sunday"],
        [DateTime.local(2024, 12, 28), "2024-12-28 Saturday"],
    ];

    test.each(cases)(
        "given %p DateTime, expect %p date string",
        (givenDate, expectedResult) => {
            const result = formatDayDate(givenDate as DateTime);
            expect(result).toEqual(expectedResult);
        }
    );
})

describe("getWeekNumber", () => {
    const cases = [
        [DateTime.local(2024, 1, 1), "Monday", 1],
        [DateTime.local(2024, 1, 7), "Sunday", 2],
        [DateTime.local(2024, 1, 27), "Saturday", 4],
        [DateTime.local(2024, 1, 29), "Monday", 5],
        [DateTime.local(2024, 2, 4), "Sunday", 6],
        [DateTime.local(2024, 2, 29), "Thursday", 9],
        [DateTime.local(2024, 3, 1), "Friday", 9],
        [DateTime.local(2024, 3, 30), "Saturday", 13],
        [DateTime.local(2024, 3, 31), "Sunday", 14],
        [DateTime.local(2024, 12, 22), "Sunday", 52],
        [DateTime.local(2024, 12, 28), "Saturday", 52],
    ];

    test.each(cases)(
        "given %p date, on %p, expect %p week number",
        (givenDate, day, expectedResult) => {
            const result = getWeekNumber(givenDate as DateTime);
            expect(result).toEqual(expectedResult as number);
        }
    );
})


    describe("formatWeekDate", () => {
        it("should ", () => {

        })
    })

    describe("resolveHomePath", () => {
        it("should ", () => {

        })
    })

    describe("checkIfFileExists", () => {
        it("should ", () => {

        })
    })

    describe("doesFileExist", () => {
        it("should ", () => {

        })
    })

    describe("validateExistingEnvVar", () => {
        it("should ", () => {

        })
    })

    describe("isEnvVarSet", () => {
        it("should ", () => {

        })
    })

    describe("resolveFileDateFormatPath", () => {
        it("should ", () => {

        })
    })

    describe("createTemplatedFile", () => {
        it("should ", () => {

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