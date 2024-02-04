import * as path from "path";
import * as fs from "fs";
import {FileDoesNotExistException} from "../Exceptions/FileDoesNotExistException.js";
import {PathNotFileException} from "../Exceptions/PathNotFileException.js";
import {MissingConfigurationException} from "../Exceptions/MissingConfigurationException.js";
import {DateTime} from "luxon";

export type EnvironmentVariable = string | undefined | null

export enum DateUnit {
    DAY = 'DAY',
    WEEK = 'WEEK',
}

/**
 * Format date to YYYY-MM-DD DDDD
 *
 * TODO: Replace default argument after exhaustive data formats handled
 *
 * @param {Date} date
 * @param {string} formatToken
 * @returns {string} YYYY-MM-DD dddd
 */
export function formatDayDate(date: DateTime, formatToken: string = "yyyy-MM-dd cccc"): string {
    return date.toFormat(formatToken)
}

/**
 * Format date to YYYY-[W]ww
 *
 * TODO: Replace default argument after exhaustive data formats handled
 *
 * @param {Date} date
 * @param {string} formatToken
 * @returns {string}  dateTime in YYYY-'W'ww format
 */
export function formatWeekDate(date: DateTime, formatToken: string = "yyyy-'W'WW"): string {
    console.log(formatToken)

    // TODO: Troubleshoot why .toFormat can't take in localWeekNumber so we can dynamically format
    // Format given weeknumber to make sure it's 2 digits, so a single digit number will have a 0 prefixed
    let weekNumber = getWeekNumber(date).toString()

    if (weekNumber.length === 1) {
        weekNumber = `0${weekNumber}`
    }

    // Manually format the date using yyyy-'W'WW format token
    return `${date.toFormat("yyyy")}-W${weekNumber}`;


    // return date.toFormat(formatToken, {locale: "en-US"})
}

/**
 * Get the Week number based on the given Date
 *
 * Not ISO 8601 as this implementation sets Sunday as the first day of the week, not the last day.
 *
 * @param date
 */
export function getWeekNumber(date: DateTime): number {
    return date.localWeekNumber
}

/**
 * A function that adds the entire path if not provided
 * @param filepath
 */
export function resolveHomePath (filepath: string): string {
    if (filepath.startsWith("~") && process.env.HOME) {
        return path.join(process.env.HOME, filepath.slice(1));
    }
    return filepath;
}

/**
 * Check if file exists in vault.
 *      If not, create it.
 *      If it does, open it.
 *      If it exists and is a folder, Throw.
 *      If it does not exist, Throw.
 * @param filePath
 */
export function checkIfFileExists(filePath: string): void {
    const path = resolveHomePath(filePath);

    if (!fs.existsSync(path)) {
        throw new FileDoesNotExistException(`File does not exist at ${path}`, path)
    }

    if (!fs.statSync(path).isFile()) {
        throw new PathNotFileException(`Path is not a file at ${path}`, path)
    }
}

/**
 * Function that checks if a file exists or not
 * @param filePath
 * @returns {boolean}
 */
export function doesFileExist(filePath: string): boolean {
    const path = resolveHomePath(filePath);

    return fs.existsSync(path) && fs.statSync(path).isFile()
}

/**
 * Checks if the environment variable was set.  Will throw an exception if not.
 *
 * @param {string} environmentVariable
 * @param {string} friendlyName
 * @throws {MissingConfigurationException} if environment variable wasn't set
 */
export function validateExistingEnvVar(environmentVariable: EnvironmentVariable | undefined | null, friendlyName: string = 'Environment variable'): void {
    console.log(friendlyName)

    if (!isEnvVarSet(environmentVariable)) {
        throw new MissingConfigurationException('Missing environment variable: ' + environmentVariable)
    }
}

/**
 * Returns a boolean if the environment variable exists or not.
 *
 * @param environmentVariable {EnvironmentVariable}
 * @returns {boolean}
 */
export function isEnvVarSet(environmentVariable: EnvironmentVariable): boolean {
    return environmentVariable !== undefined && environmentVariable !== null && environmentVariable !== ''
}

/**
 * Get the full path to a file using the correct date format
 *
 * TODO: Replace default argument after exhaustive data formats handled
 *
 * @param pathDirectory {string}
 * @param date {Date}
 * @param dateUnit {DateUnit}
 * @param formatToken {string}
 * @returns {string}
 */
export function resolveFileDateFormatPath(pathDirectory: string, date: DateTime, dateUnit: DateUnit, formatToken: string): string {

    if (dateUnit === DateUnit.WEEK){
        return `${path.join(resolveHomePath(pathDirectory), formatWeekDate(date, formatToken))}.md`
    }

    return `${path.join(resolveHomePath(pathDirectory), formatDayDate(date, formatToken))}.md`
}

/**
 * Given a file path and valid templateFilePath, create a new file.
 *
 * @param filePath {string}
 * @param templateFilePath {string}
 * @throws {FileDoesNotExistException}
 */
 export function createTemplatedFile(filePath: string, templateFilePath: string): void {
     // 1. Check that the provided filePath does not exist.
    if (doesFileExist(filePath)) {
        throw new Error(`File already exists at ${filePath}`)
    }

    // 1. Check if templateFilePath given is actually a file
    let templateFileContent = ''

    checkIfFileExists(templateFilePath)

    const fullTemplateFilePath = resolveHomePath(templateFilePath)

    try {
        templateFileContent = fs.readFileSync(fullTemplateFilePath, 'utf8')
    } catch (e) {
        throw new Error(`Could not read template file at ${fullTemplateFilePath}`)
    }

    const fullFilePath = resolveHomePath(filePath)

    // 2. Create new file from template
    try{
        fs.writeFileSync(fullFilePath, templateFileContent)
    } catch (e) {
        throw new Error(`Could not create templated file at ${filePath}`)
    }
}

const momentToLuxonMap: Record<string, string> = {
    "[": "'",
    "\\[": "'\\'",
    "\\]": "'",
    "]": "'",
    "A": "a",
    "D": "d",
    "DD": "dd",
    "DDD": "o",
    "DDDD": "ooo",
    "H": "H",
    "HH": "HH",
    "M": "L",
    "MM": "LL",
    "MMM": "LLL",
    "MMMM": "LLLL",
    "Mo": "L",
    "Q": "q",
    "S": "S",
    "SS": "SS",
    "SSS": "SSS",
    "X": "X",
    "YY": "yy",
    "YYYY": "yyyy",
    "Z": "ZZ",
    "ZZ": "ZZ",
    "a": "a",
    "d": "c",
    "ddd": "ccc",
    "dddd": "cccc",
    "h": "h",
    "hh": "hh",
    "m": "m",
    "mm": "mm",
    "s": "s",
    "ss": "ss",
    "w": "W",
    "ww": "WW",
    "x": "x",
};

export const mapMomentToLuxonTokenFormat = (momentFormat: string) => {
    // Regular expression for capturing the moment tokens
    const tokenRegex = new RegExp(Object.keys(momentToLuxonMap).join('|'), 'g');

    // Replacing the moment tokens with the matching luxon tokens
    return momentFormat.replace(tokenRegex, match => momentToLuxonMap[match] || match);
}