import { DateTime } from 'luxon'
import { IFileProvider } from '../File/FileProvider.js'

/**
 * {@link Ordinal} is an enum that represents the position in a series of {@link Interval} of a note.
 * It can be Current, Next, or Previous.
 */
export enum Ordinal {
  Current = 'Current',
  Next = 'Next',
  Previous = 'Previous',
}

/**
 * The ordinalMap is a map that maps {@link Ordinal} enums to integers.
 * Used to convert {@link Ordinal} enums to integers for use in luxon date calculations.
 */
const ordinalMap = {
  [Ordinal.Current]: 0,
  [Ordinal.Next]: 1,
  [Ordinal.Previous]: -1,
}

/**
 * {@link Interval} is an enum that represents the time interval of a note.
 */
export enum Interval {
  Daily = 'Daily',
  Weekly = 'Weekly',
  Monthly = 'Monthly',
  Quarterly = 'Quarterly',
  Annually = 'Annually',
}

/**
 * The intervalMap maps {@link Interval} enums to Luxon strings.
 */
const intervalMap = {
  [Interval.Annually]: 'year',
  [Interval.Daily]: 'day',
  [Interval.Monthly]: 'month',
  [Interval.Quarterly]: 'quarter',
  [Interval.Weekly]: 'week',
}

export interface ChronoType {
  ordinal: Ordinal
  interval: Interval
}

/**
 * {@link IChronoNote} is an interface that represents a chronological note.
 *
 * It contains methods for getting the interval, date, and template. It also contains a method for formatting the date.
 * @template {Interval} getInterval - Returns the interval of the note.
 * @template {Ordinal} getOrdinal - Returns the ordinal of the note.
 * @template {DateTime} getDate - Returns the date of the note.
 * @template {string} getTemplate - Returns the template of the note.
 * @template {string} formatDate - Returns the formatted date of the note.
 */
export interface IChronoNote {
  getInterval: () => Interval
  getOrdinal: () => Ordinal
  getDate: () => DateTime
  getTemplate: (templatePath: string) => string
  formatDate: (formatToken: string) => string
}

/**
 * ChronoNote is a class that represents a chronological note.
 */
export class ChronoNote implements IChronoNote {
  private readonly type: ChronoType
  private fileProvider: IFileProvider
  private date: DateTime = DateTime.now()

  constructor(
    type: ChronoType,
    fileProvider: IFileProvider,
    providedDate: DateTime = DateTime.now(),
  ) {
    this.type = type
    this.fileProvider = fileProvider
    this.setDate(providedDate)
  }

  /**
   * Function that gets the {@link Interval} of the ChronoNote.
   * @returns - Returns the {@link Interval}.
   */
  getInterval(): Interval {
    return this.type.interval
  }

  /**
   * Function that gets the {@link Ordinal} of the ChronoNote.
   * @returns Returns the {@link Ordinal}.
   */
  getOrdinal(): Ordinal {
    return this.type.ordinal
  }

  /**
   * Function that gets the {@link DateTime} of the ChronoNote.
   * @returns - The datetime of the note.
   */
  getDate(): DateTime {
    return this.date
  }

  /**
   * Fetch the template file content based on the given template path.
   *
   * TODO:  Make this generic enough to support more than one templates type per {@link ChronoType}.
   * @param templatePath - The path to the template file.
   * @returns The template file content.
   */
  getTemplate(templatePath: string): string {
    return this.fileProvider.readTemplate(templatePath)
  }

  /**
   * Uses the ChronoType to set the correct date using both the given Ordinal and Interval.
   *
   * Luxon has an identifier to know what interval to add or subtract to a {@link DateTime} context,
   * which is captured by the {@link intervalMap} context.
   *
   * We also need the amount to add or subtract, which is captured by the {@link ordinalMap} context.
   * See {@link https://moment.github.io/luxon/api-docs/index.html#datetimeplus} for reference.
   * @param providedDate - The date to set the note to based on the configured {@link Interval} and {@link Ordinal}.
   */
  setDate(providedDate: DateTime): void {
    this.date = providedDate.plus({
      [intervalMap[this.type.interval]]: ordinalMap[this.type.ordinal],
    })
    console.info(
      `Date with ${this.type.interval} interval and ${this.type.ordinal} ordinal set to: ${this.date.toFormat('yyyy-MM-dd')}`,
    )
  }

  /**
   * Format date using the given format token.
   * @param formatToken - The format token from Luxon to use for formatting the date.
   * @returns The formatted datetime string.
   */
  formatDate(formatToken: string): string {
    return this.date.toFormat(formatToken)
  }

  /**
   * Format date to yyyy-MM-dd cccc.
   *
   * TODO: Replace default argument after exhaustive date formats handled.
   * @param formatToken - The format token from Luxon to use for formatting the date.
   * @returns Yyyy-MM-dd cccc.
   */
  formatDayDate(formatToken: string = 'yyyy-MM-dd cccc'): string {
    return this.date.toFormat(formatToken)
  }

  /**
   * Format date to YYYY-[W]ww.
   *
   * TODO: Replace default argument after exhaustive date formats handled.
   * @param formatToken - The format token from Luxon to use for formatting the date.
   * @returns - DateTime in YYYY-'W'ww format.
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
    return `${this.date.toFormat('yyyy')}-W${weekNumber}`

    // return date.toFormat(formatToken, {locale: "en-US"})
  }

  /**
   * Get the Week number based on the given Date.
   * Not ISO 8601 as this implementation sets Sunday as the first day of the week, not the last day.
   * @returns - Returns the luxon {@link DateTime} week number.
   */
  getWeekNumber(): number {
    return this.date.localWeekNumber
  }
}
