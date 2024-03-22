import { MissingConfigurationException } from "../Exceptions/MissingConfigurationException.js";
import { EnvironmentVariable } from "./Config/ConfigProvider.js";
import { ChronoType, Interval, Ordinal } from "./Chrono/ChronoNote.js";
import { InvalidEntrypointArguments } from "../Exceptions/InvalidEntrypointArguments.js";

/**
 * Parse ChronoType from args.
 * @param input - The input string to parse a combined {@link Interval} and {@link Ordinal} from.
 * @returns Returns an instance of {@link ChronoType} with the parsed {@link Interval} and {@link Ordinal}.
 * @throws {InvalidEntrypointArguments} If input is not a valid ChronoType.
 */
export function parseChronoNoteArg(input: string): ChronoType {
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
    throw new InvalidEntrypointArguments(
      "Provided entrypoint arguments are invalid",
    );
  }
}

/**
 * Checks if the environment variable was set.  Will throw an exception if not.
 * @param environmentVariable - The running environment's variable.
 * @param friendlyName - A user-friendly name that describes the env var.
 * @throws {MissingConfigurationException} If environment variable wasn't set.
 */
export function validateExistingEnvVar(
  environmentVariable: EnvironmentVariable | undefined | null,
  friendlyName: string = "Environment variable",
): void {
  console.info(`Checking if ${friendlyName} variable is set`);

  if (!isEnvVarSet(environmentVariable)) {
    throw new MissingConfigurationException(
      "Missing environment variable: " + environmentVariable,
    );
  }
}

/**
 * Returns a boolean if the environment variable exists or not.
 * @param environmentVariable - The running environment's variable.
 * @returns Returns a boolean if the environment variable exists or not.
 */
export function isEnvVarSet(environmentVariable: EnvironmentVariable): boolean {
  return (
    environmentVariable !== undefined &&
    environmentVariable !== null &&
    environmentVariable !== ""
  );
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
