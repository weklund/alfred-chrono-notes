import * as path from "path";
import * as fs from "fs";
import { FileDoesNotExistException } from "../Exceptions/FileDoesNotExistException.js";
import { PathNotFileException } from "../Exceptions/PathNotFileException.js";
import { MissingConfigurationException } from "../Exceptions/MissingConfigurationException.js";
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
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
 * @returns {string} YYYY-MM-DD DDDD
 */
export function formatDayDate(date, formatToken = "YYYY-MM-DD DDDD") {
    let month = date.getMonth() + 1;
    // We have to do this because just getting January will return '1' and we want '01'
    // TODO: Improve implementation once we handle all data formats
    const monthFormat = month.toString().length == 1 ? '0' + month : month;
    return `${date.getFullYear()}-${monthFormat}-${date.getDate()} ${DAYS[date.getDay()]}`;
}
/**
 * Format date to YYYY-[W]ww
 *
 * TODO: Replace default argument after exhaustive data formats handled
 *
 * @param {Date} date
 * @param {string} formatToken
 * @returns {string} YYYY-MM-DD DDDD
 */
export function formatWeekDate(date, formatToken = "YYYY-[W]ww") {
    const weekNumber = getWeekNumber(date);
    // We have to do this because just getting single digit will return '1' and we want '01'
    // TODO: Improve implementation once we handle all data formats
    const weekFormat = weekNumber.toString().length == 1 ? '0' + weekNumber : weekNumber.toString();
    return `${date.getFullYear()}-W${weekFormat}`;
}
/**
 * Get the Week number based on the given Date
 *
 * Not ISO 8601 as this implementation sets Sunday as the first day of the week, not the last day.
 *
 * @param date
 */
export function getWeekNumber(date) {
    // Copy date so don't modify original
    // Using UTC ensure leap year adjustments are already accounted for
    let utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    // Set to nearest Thursday: current date + 4 - current day number
    utcDate.setUTCDate(utcDate.getUTCDate() + 4 - (utcDate.getUTCDay()));
    // Get first day of year
    let yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));
    const millisecondsInDay = 1000 * 60 * 60 * 24;
    // Calculate full weeks to nearest Thursday
    return Math.ceil((((utcDate.getTime() - yearStart.getTime()) / millisecondsInDay) + 1) / 7);
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
