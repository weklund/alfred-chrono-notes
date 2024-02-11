import {EnvConfigDriver} from "./drivers/EnvConfigDriver";

export type EnvironmentVariable = string | undefined | null

export interface AppConfig {
    OBSIDIAN_VAULT_NAME: string;
    [key: string]: string | undefined; // To allow for dynamic interval keys
}

export interface ConfigDriver {
    get(key: string): EnvironmentVariable;
}

export interface IntervalConfig {
    // The folder where the notes are stored
    folderPath: string;
    // The file name format to use
    pathFormat: string;
    // The file path where the desired note template is
    templatePath: string;
}

export class ConfigProvider {
    private driver: ConfigDriver;

    constructor(driver?: ConfigDriver) {
        this.driver = driver ?? new EnvConfigDriver();
    }

    get(key: string): EnvironmentVariable {
        return this.driver.get(key);
    }

    // Method to get interval configurations, assuming intervals are known
    getIntervalConfig(interval: string): IntervalConfig {
        return {
            folderPath: this.get(`${interval.toUpperCase()}_FOLDER_PATH`) ?? '',
            pathFormat: this.get(`${interval.toUpperCase()}_PATH_FORMAT`) ?? '',
            templatePath: this.get(`${interval.toUpperCase()}_TEMPLATE_PATH`) ?? '',
        };
    }
}




