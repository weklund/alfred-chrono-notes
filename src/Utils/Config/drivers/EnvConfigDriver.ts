import {isEnvVarSet} from "../../CommonUtils.js";
import {ConfigDriver, EnvironmentVariable, IntervalConfig} from "../ConfigProvider.js";
import {MissingConfigurationException} from "../../../Exceptions/MissingConfigurationException.js";

/**
 * @class EnvConfigDriver
 *
 * @description The default Env ConfigDriver that uses process.env
 * @implements ConfigDriver
 */
export class EnvConfigDriver implements ConfigDriver {
    get(key: string): EnvironmentVariable {
        return process.env[key];
    }

    // Method to get interval configurations, assuming intervals are known
    getIntervalConfig(interval: string): IntervalConfig {
        const fileFormatVar = `${interval.toUpperCase()}_FILE_FORMAT`;
        const folderPathVar = `${interval.toUpperCase()}_PATH`;
        const templatePathVar = `${interval.toUpperCase()}_TEMPLATE_PATH`;

        console.log(`File Format: ${this.get(fileFormatVar)}`)
        console.log(`Folder path: ${this.get(folderPathVar)}`)
        console.log(`Template path: ${this.get(templatePathVar)}`)

        return {
            FILE_FORMAT: this.get(fileFormatVar) ?? '',
            FOLDER_PATH: this.get(folderPathVar) ?? '',
            TEMPLATE_PATH: this.get(templatePathVar) ?? '',
        };
    }

    /**
     * Check that the required interval config variables are set
     * Specifically checking 3 variables in {@link IntervalConfig}
     * If it's not set then throw {@link MissingConfigurationException}
     *
     * @param intervalVars
     */
    validateIntervalConfig(intervalVars: IntervalConfig) {
        Object.keys(intervalVars).forEach((key) => {
            const typedKey = key as keyof IntervalConfig;

            if (!isEnvVarSet(intervalVars[typedKey])) {
                throw new MissingConfigurationException(`Missing environment variable: ${typedKey}`)
            }
        });
    }
}
