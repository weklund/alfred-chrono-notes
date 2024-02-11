import * as path from "path";
import * as fs from "fs";
import {PathNotFileException} from "../Exceptions/PathNotFileException.js";
import {MissingConfigurationException} from "../Exceptions/MissingConfigurationException.js";
import {FileDoesNotExistException} from "../Exceptions/FileDoesNotExistException.js";
import {InvalidFilePathSchemaException} from "../Exceptions/InvalidFilePathSchemaException.js";
import {EnvironmentVariable} from "./Config/ConfigProvider";

/**
 * A function that adds the entire path if not provided
 *
 * @param filepath {string}
 */
export function resolveHomePath (filepath: string): string {
    if (filepath.startsWith("~") && process.env.HOME) {
        return path.join(process.env.HOME, filepath.slice(1));
    }
    return filepath;
}

/**
 * Check if path is valid.
 *
 * Provides a security check to prevent an attacker to execute arbitrary code.
 *
 * Mitigates the ESlint rule security/detect-non-literal-fs-filename
 * @link https://github.com/eslint-community/eslint-plugin-security/blob/main/docs/rules/detect-non-literal-fs-filename.md
 *
 * @param path
 * @returns {boolean}
 */
export function isValidPathSchema(path: string): boolean {
    // TODO: Remove after through testing
    const regex = /^[a-zA-Z0-9][a-zA-Z0-9._/-]*$/;

    // Get current mac user from node env or os
    // const regex = /^(?:\/Users\/[a-zA-Z0-9_-]+\/)?[a-zA-Z0-9._/-]*$/;

    return regex.test(path);
}

/**
 * Check if file exists in vault.
 *
 * @param filePath {string}
 * @throws {InvalidFilePathSchemaException} if the provided path is not valid
 * @throws {FileDoesNotExistException} if the provided path does not exist
 * @throws {PathNotFileException} if the provided path is not a file
 */
export function checkIfFileExists(filePath: string): void {
    const path = resolveHomePath(filePath);

    if(!isValidPathSchema(path)) {
        throw new InvalidFilePathSchemaException(`Invalid path schema: ${path}`)
    }

    if (isValidPathSchema(path) && !fs.existsSync(path)) {
        throw new FileDoesNotExistException(`File does not exist at ${path}`)
    }

    if (isValidPathSchema(path) && !fs.statSync(path).isFile()) {
        throw new PathNotFileException(`Path is not a file at ${path}`)
    }
}

/**
 * Function that checks if a file exists or not
 *
 * @param filePath {string}
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

// TODO:  Reconsider supporting both moment and luxon
// const momentToLuxonMap: Record<string, string> = {
//     "[": "'",
//     "\\[": "'\\'",
//     "\\]": "'",
//     "]": "'",
//     "A": "a",
//     "D": "d",
//     "DD": "dd",
//     "DDD": "o",
//     "DDDD": "ooo",
//     "H": "H",
//     "HH": "HH",
//     "M": "L",
//     "MM": "LL",
//     "MMM": "LLL",
//     "MMMM": "LLLL",
//     "Mo": "L",
//     "Q": "q",
//     "S": "S",
//     "SS": "SS",
//     "SSS": "SSS",
//     "X": "X",
//     "YY": "yy",
//     "YYYY": "yyyy",
//     "Z": "ZZ",
//     "ZZ": "ZZ",
//     "a": "a",
//     "d": "c",
//     "ddd": "ccc",
//     "dddd": "cccc",
//     "h": "h",
//     "hh": "hh",
//     "m": "m",
//     "mm": "mm",
//     "s": "s",
//     "ss": "ss",
//     "w": "W",
//     "ww": "WW",
//     "x": "x",
// };
//
// export const mapMomentToLuxonTokenFormat = (momentFormat: string) => {
//     // Regular expression for capturing the moment tokens
//     const tokenRegex = new RegExp(Object.keys(momentToLuxonMap).join('|'), 'g');
//
//     // Replacing the moment tokens with the matching luxon tokens
//     return momentFormat.replace(tokenRegex, match => momentToLuxonMap[match] || match);
// }