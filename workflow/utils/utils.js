import * as path from "path";
import * as fs from "fs";
import { FileDoesNotExistException } from "../Exceptions/FileDoesNotExistException.js";
import { PathNotFileException } from "../Exceptions/PathNotFileException.js";
import { MissingConfigurationException } from "../Exceptions/MissingConfigurationException.js";
export var DateUnit;
(function (DateUnit) {
    DateUnit["DAY"] = "DAY";
    DateUnit["WEEK"] = "WEEK";
})(DateUnit || (DateUnit = {}));
/**
 * Format date to YYYY-MM-DD DDDD
 *
 * TODO: Replace default argument after exhaustive data formats handled
 *
 * @param {Date} date
 * @param {string} formatToken
 * @returns {string} YYYY-MM-DD dddd
 */
export function formatDayDate(date, formatToken = "yyyy-MM-dd cccc") {
    return date.toFormat(formatToken);
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
export function formatWeekDate(date, formatToken = "yyyy-'W'WW") {
    return date.toFormat(formatToken);
}
/**
 * Get the Week number based on the given Date
 *
 * Not ISO 8601 as this implementation sets Sunday as the first day of the week, not the last day.
 *
 * @param date
 */
export function getWeekNumber(date) {
    return date.localWeekNumber;
}
/**
 * A function that adds the entire path if not provided
 * @param filepath
 */
export function resolveHomePath(filepath) {
    if (filepath[0] === "~" && process.env.HOME) {
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
export function checkIfFileExists(filePath) {
    const path = resolveHomePath(filePath);
    if (!fs.existsSync(path)) {
        throw new FileDoesNotExistException(`File does not exist at ${path}`, path);
    }
    if (!fs.statSync(path).isFile()) {
        throw new PathNotFileException(`Path is not a file at ${path}`, path);
    }
}
/**
 * Function that checks if a file exists or not
 * @param filePath
 * @returns {boolean}
 */
export function doesFileExist(filePath) {
    const path = resolveHomePath(filePath);
    return fs.existsSync(path) && fs.statSync(path).isFile();
}
/**
 * Validates if the environment variable was set.  Additionally, console logs the set env var
 *
 * @param {string} environmentVariable
 * @param {string} friendlyName
 * @throws {MissingConfigurationException} if environment variable wasn't set
 */
export function validateExistingEnvVar(environmentVariable, friendlyName = 'Environment variable') {
    if (!isEnvVarSet(environmentVariable)) {
        throw new MissingConfigurationException('Missing environment variable: ' + environmentVariable);
    }
}
/**
 * Returns a boolean if the environment variable exists or not.
 *
 * @param environmentVariable {EnvironmentVariable}
 * @returns {boolean}
 */
export function isEnvVarSet(environmentVariable) {
    return environmentVariable !== undefined && environmentVariable !== null && environmentVariable !== '';
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
export function resolveFileDateFormatPath(pathDirectory, date, dateUnit, formatToken) {
    if (dateUnit === DateUnit.WEEK) {
        return `${path.join(resolveHomePath(pathDirectory), formatWeekDate(date, formatToken))}.md`;
    }
    return `${path.join(resolveHomePath(pathDirectory), formatDayDate(date, formatToken))}.md`;
}
/**
 * Given a file path and valid templateFilePath, create a new file.
 *
 * @param filePath {string}
 * @param templateFilePath {string}
 * @throws {FileDoesNotExistException}
 */
export function createTemplatedFile(filePath, templateFilePath) {
    // 1. Validate that the provided filePath does not exist.
    if (doesFileExist(filePath)) {
        throw new Error(`File already exists at ${filePath}`);
    }
    // 1. Check if templateFilePath given is actually a file
    let templateFileContent = '';
    checkIfFileExists(templateFilePath);
    let fullTemplateFilePath = resolveHomePath(templateFilePath);
    try {
        templateFileContent = fs.readFileSync(fullTemplateFilePath, 'utf8');
    }
    catch (e) {
        throw new Error(`Could not read template file at ${fullTemplateFilePath}`);
    }
    let fullFilePath = resolveHomePath(filePath);
    // 2. Create new file from template
    try {
        fs.writeFileSync(fullFilePath, templateFileContent);
    }
    catch (e) {
        throw new Error(`Could not create templated file at ${filePath}`);
    }
}
const momentToLuxonMap = {
    "M": "L",
    "Mo": "L",
    "MM": "LL",
    "MMM": "LLL",
    "MMMM": "LLLL",
    "Q": "q",
    "D": "d",
    "DD": "dd",
    "DDD": "o",
    "DDDD": "ooo",
    "d": "c",
    "ddd": "ccc",
    "dddd": "cccc",
    "w": "W",
    "ww": "WW",
    "YY": "yy",
    "YYYY": "yyyy",
    "A": "a",
    "a": "a",
    "H": "H",
    "HH": "HH",
    "h": "h",
    "hh": "hh",
    "m": "m",
    "mm": "mm",
    "s": "s",
    "ss": "ss",
    "S": "S",
    "SS": "SS",
    "SSS": "SSS",
    "Z": "ZZ",
    "ZZ": "ZZ",
    "X": "X",
    "x": "x",
    "[": "'",
    "]": "'",
    "\\[": "'\\'",
    "\\]": "'",
};
export const mapMomentToLuxonTokenFormat = (momentFormat) => {
    // Regular expression for capturing the moment tokens
    const tokenRegex = new RegExp(Object.keys(momentToLuxonMap).join('|'), 'g');
    // Replacing the moment tokens with the equivalent luxon tokens
    return momentFormat.replace(tokenRegex, match => momentToLuxonMap[match] || match);
};
