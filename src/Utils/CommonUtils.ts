import * as fs from "fs";
import {MissingConfigurationException} from "../Exceptions/MissingConfigurationException.js";
import {EnvironmentVariable} from "./Config/ConfigProvider";

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