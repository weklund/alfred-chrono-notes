import {DateTime} from "luxon";

import {InvalidEntrypointArguments} from "../../Exceptions/InvalidEntrypointArguments.js";
import {resolveHomePath} from "../CommonUtils.js";

export enum Ordinal {
    Current = "Current",
    Next = "Next",
    Previous = "Previous"
}

const ordinalMap = {
    [Ordinal.Current]: 0,
    [Ordinal.Next]: 1,
    [Ordinal.Previous]: -1
}

export enum Interval {
    Daily = "Daily",
    Weekly = "Weekly",
    Monthly = "Monthly",
    Quarterly = "Quarterly",
    Annually = "Annually"
}

const intervalMap = {
    [Interval.Annually]: 'year',
    [Interval.Daily]: 'day',
    [Interval.Monthly]: 'month',
    [Interval.Quarterly]: 'quarter',
    [Interval.Weekly]: 'week'
}

export interface ChronoType {
    ordinal: Ordinal;
    interval: Interval;
}

/**
 * Parse ChronoType from args
 *
 * @param input
 */
export function parseChronoNoteArg(input: string): ChronoType {

    // Attempt to extract ordinal and interval from the input string
    let ordinal: Ordinal | null = null;
    let interval: Interval | null = null;

    // Check each Ordinal and Interval to find a match
    Object.values(Ordinal).forEach((o) => {
        if (input.toLowerCase().includes(o.toLowerCase())) {
            ordinal = Ordinal[o as keyof typeof Ordinal];
        }
    });

    Object.values(Interval).forEach((i) => {
        if (input.toLowerCase().includes(i.toLowerCase())) {
            interval = Interval[i as keyof typeof Interval];
        }
    });

    // If both ordinal and interval are found, return the result
    if (ordinal && interval) {
        return { interval, ordinal } as ChronoType;
    } else {
        // If either is not found, throw exemption
        throw new InvalidEntrypointArguments("Provided entrypoint arguments are invalid");
    }
}

export class ChronoNote {
    private readonly chronoType: ChronoType;
    private date: DateTime = DateTime.now();

    constructor(chronoType: ChronoType) {
        this.chronoType = chronoType
        this.setDate();
    }

    getInterval(){
        return this.chronoType.interval;
    }

    /**
     * Uses the ChronoType to set the correct date using both the given Ordinal and Interval.
     *
     * Luxon has an identifier to know what interval to add or subtract to a {@link DateTime} context,
     * which is captured by the {@link intervalMap} context.
     *
     * We also need the amount to add or subtract, which is captured
     * by the {@link ordinalMap} context.
     *
     */
    setDate(): void {
        this.date = this.date.plus({
            [intervalMap[this.chronoType.interval]]: ordinalMap[this.chronoType.ordinal]
        })
    }

    /**
     * Format date to yyyy-MM-dd cccc
     *
     * TODO: Replace default argument after exhaustive data formats handled
     *
     * @param {string} formatToken
     * @returns {string} yyyy-MM-dd cccc
     */
    formatDayDate(formatToken: string = "yyyy-MM-dd cccc"): string {
        return this.date.toFormat(formatToken)
    }

    /**
     * Format date to YYYY-[W]ww
     *
     * TODO: Replace default argument after exhaustive data formats handled
     *
     * @param {string} formatToken
     * @returns {string}  dateTime in YYYY-'W'ww format
     */
    formatWeekDate(formatToken: string = "yyyy-'W'WW"): string {
        console.log(formatToken)

        // TODO: Troubleshoot why .toFormat can't take in localWeekNumber so we can dynamically format
        // Format given weeknumber to make sure it's 2 digits, so a single digit number will have a 0 prefixed
        let weekNumber = this.getWeekNumber().toString()

        if (weekNumber.length === 1) {
            weekNumber = `0${weekNumber}`
        }

        // Manually format the date using yyyy-'W'WW format token
        return `${this.date.toFormat("yyyy")}-W${weekNumber}`;


        // return date.toFormat(formatToken, {locale: "en-US"})
    }

    /**
     * Get the Week number based on the given Date
     *
     * Not ISO 8601 as this implementation sets Sunday as the first day of the week, not the last day.
     *
     */
    getWeekNumber(): number {
        return this.date.localWeekNumber
    }

    /**
     * Get the full path to a file using the correct date format
     *
     * TODO: Replace default argument after exhaustive data formats handled
     *
     * @param pathDirectory {string}
     * @param formatToken {string}
     * @returns {string}
     */
    resolveFileDateFormatPath(pathDirectory: string, formatToken: string): string {

        if (this.chronoType.interval === Interval.Weekly){
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
            return `${path.join(resolveHomePath(pathDirectory), this.formatWeekDate(formatToken))}.md`
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
        return `${path.join(resolveHomePath(pathDirectory), this.formatDayDate(formatToken))}.md`
    }

}