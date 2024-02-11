import {MissingConfigurationException} from "../Exceptions/MissingConfigurationException.js";
import {EnvironmentVariable} from "./Config/ConfigProvider.js";

/**
 * Checks if the environment variable was set.  Will throw an exception if not.
 *
 * @param {string} environmentVariable
 * @param {string} friendlyName
 * @throws {MissingConfigurationException} if environment variable wasn't set
 */
export function validateExistingEnvVar(environmentVariable: EnvironmentVariable | undefined | null, friendlyName: string = 'Environment variable'): void {
    console.info(`Checking if ${friendlyName} variable is set`)

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