import {DateTime} from "luxon"
import {FileProvider, IFileProvider} from "../File/FileProvider.js"
import {InvalidEntrypointArguments} from "../../Exceptions/InvalidEntrypointArguments.js"
import {InvalidDateFormatException} from "../../Exceptions/InvalidDateFormatException.js"

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
    ordinal: Ordinal
    interval: Interval
}

export interface IChronoNote {
    getInterval: () => Interval
    getDate: () => DateTime
    getTemplate: (templatePath: string) => string
    formatDate: (formatToken: string) => string
}

/**
 * Parse ChronoType from args
 *
 * @param input
 */
export function parseChronoNoteArg(input: string): ChronoType {

    // Attempt to extract ordinal and interval from the input string
    let ordinal: Ordinal | null = null
    let interval: Interval | null = null

    // Check each Ordinal and Interval to find a match
    Object.values(Ordinal).forEach((o) => {
        if (input.toLowerCase().includes(o.toLowerCase())) {
            ordinal = Ordinal[o as keyof typeof Ordinal]
        }
    })

    Object.values(Interval).forEach((i) => {
        if (input.toLowerCase().includes(i.toLowerCase())) {
            interval = Interval[i as keyof typeof Interval]
        }
    })

    // If both ordinal and interval are found, return the result
    if (ordinal && interval) {
        return { interval, ordinal } as ChronoType
    } else {
        // If either is not found, throw exemption
        throw new InvalidEntrypointArguments("Provided entrypoint arguments are invalid")
    }
}

/**
 * ChronoNote is a class that represents a chronological note.
 */
export class ChronoNote implements IChronoNote {
    private readonly type: ChronoType
    private fileHelper: IFileProvider
    private date: DateTime = DateTime.now()

    constructor(
        type: ChronoType,
        fileHelper: IFileProvider = new FileProvider(),
        providedDate: DateTime = DateTime.now()
    ) {
        this.type = type
        this.fileHelper = fileHelper
        this.setDate(providedDate)
    }

    /**
     *
     */
    getInterval(){
        return this.type.interval
    }

    getDate(): DateTime {
        return this.date
    }

    /**
     * Fetch the template file content based on the given template path.
     *
     * @param templatePath
     */
    getTemplate(templatePath: string): string {
        return this.fileHelper.readTemplate(templatePath)
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
     * @param providedDate {DateTime}
     *
     */
    setDate(providedDate: DateTime): void {
        this.date = providedDate.plus({
            [intervalMap[this.type.interval]]: ordinalMap[this.type.ordinal]
        })
        console.info(`Date with ${this.type.interval} interval and ${this.type.ordinal} ordinal set to: ${this.date.toFormat("yyyy-MM-dd")}`)
    }

    /**
     *
     * @param formatToken
     */
    formatDate(formatToken: string): string {
        const formattedDate = this.date.toFormat(formatToken)

        if(!formattedDate) {
            throw new InvalidDateFormatException(`The provided formatToken is invalid: ${formatToken}`)
        }

        return this.date.toFormat(formatToken)
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
        return `${this.date.toFormat("yyyy")}-W${weekNumber}`


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

}