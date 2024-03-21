import { isEnvVarSet } from "../../CommonUtils.js";
import {
  ConfigDriver,
  EnvironmentVariable,
  IntervalConfig,
} from "../ConfigProvider.js";
import { MissingConfigurationException } from "../../../Exceptions/MissingConfigurationException.js";

/**
 * @class EnvConfigDriver
 * @implements {ConfigDriver} ConfigDriver
 * @description The default Env ConfigDriver that uses process.env.
 */
export class EnvConfigDriver implements ConfigDriver {
  get(key: string): EnvironmentVariable {
    return process.env[key];
  }

  /**
   * Method to get interval configurations, assuming intervals are known.
   * @param {string} interval - The interval to get the config for.
   * @returns {IntervalConfig} - The interval config for the given interval.
   */
  getIntervalConfig(interval: string): IntervalConfig {
    const fileFormatVar = `${interval.toUpperCase()}_FILE_FORMAT`;
    const folderPathVar = `${interval.toUpperCase()}_PATH`;
    const templatePathVar = `${interval.toUpperCase()}_TEMPLATE_PATH`;

    console.log(`File Format: ${this.get(fileFormatVar)}`);
    console.log(`Folder path: ${this.get(folderPathVar)}`);
    console.log(`Template path: ${this.get(templatePathVar)}`);

    return {
      FILE_FORMAT: this.get(fileFormatVar) ?? "",
      FOLDER_PATH: this.get(folderPathVar) ?? "",
      TEMPLATE_PATH: this.get(templatePathVar) ?? "",
    };
  }

  /**
   * Check that the required interval config variables are set
   * Specifically checking 3 variables in {@link IntervalConfig}
   * If it's not set then throw {@link MissingConfigurationException}.
   * @param {IntervalConfig} intervalVars - The interval config variables to check.
   * @throws {MissingConfigurationException} - If any of the required variables are not set.
   */
  validateIntervalConfig(intervalVars: IntervalConfig) {
    Object.keys(intervalVars).forEach((key) => {
      const typedKey = key as keyof IntervalConfig;

      if (!isEnvVarSet(intervalVars[typedKey])) {
        throw new MissingConfigurationException(
          `Missing environment variable: ${typedKey}`,
        );
      }
    });
  }
}
