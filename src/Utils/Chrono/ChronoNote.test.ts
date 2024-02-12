import {DateTime} from "luxon";

describe('ChronoNote Tests', () => {

    describe('parseChronoNoteArg function', () => {

        it('should parse and return a valid ChronoType from an arg string', () => {

        })

        it('should throw InvalidEntrypointArguments when given invalid interval arg', () => {

        })

        it('should throw InvalidEntrypointArguments when given invalid ordinal arg', () => {

        })
    })


    describe('ChronoNote class tests', () => {
        const opts = {locale: "en-US"};

        it('should create a ChronoNote based on given ChronoType', () => {

        })

        describe("formatDayDate", () => {


            const cases = [
                [DateTime.local(2024, 1, 1, opts), "2024-01-01 Monday"],
                [DateTime.local(2024, 1, 7, opts), "2024-01-07 Sunday"],
                [DateTime.local(2024, 1, 27, opts), "2024-01-27 Saturday"],
                [DateTime.local(2024, 1, 29, opts), "2024-01-29 Monday"],
                [DateTime.local(2024, 2, 4, opts), "2024-02-04 Sunday"],
                [DateTime.local(2024, 2, 29, opts), "2024-02-29 Thursday"],
                [DateTime.local(2024, 3, 1, opts), "2024-03-01 Friday"],
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
                [DateTime.local(2024, 1, 1, opts), "2024-W01"],
                [DateTime.local(2024, 2, 4, opts), "2024-W06"],
                [DateTime.local(2024, 12, 22, opts), "2024-W52"],
                [DateTime.local(2025, 2, 28, opts), "2025-W09"],
                [DateTime.local(2020, 2, 29, opts), "2020-W09"],
                [DateTime.local(2024, 3, 30, opts), "2024-W13"],
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
                (givenDate, _, expectedResult) => {
                    const result = getWeekNumber(givenDate as DateTime);
                    expect(result).toEqual(expectedResult as number);
                }
            );
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

})