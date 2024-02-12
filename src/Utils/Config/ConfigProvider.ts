import {EnvConfigDriver} from "./drivers/EnvConfigDriver.js";
import {Interval} from "../Chrono/ChronoNote.js";

export type EnvironmentVariable = string | undefined | null

export interface ConfigDriver {
    get(key: string): EnvironmentVariable
    getIntervalConfig(interval: Interval): IntervalConfig
    validateIntervalConfig(intervalConfig: IntervalConfig): void
}

export interface IntervalConfig {
    // The folder where the notes are stored
    FOLDER_PATH: string;
    // The file name format to use
    FILE_FORMAT: string;
    // The file path where the desired note template is
    TEMPLATE_PATH: string;
}

export interface IConfigProvider {
    get(key: string): EnvironmentVariable
    getIntervalConfig(interval: Interval): IntervalConfig
    validateIntervalConfig(intervalConfig: IntervalConfig): void
}

export class ConfigProvider implements IConfigProvider {
    private driver: ConfigDriver;

    constructor(driver?: ConfigDriver) {
        this.driver = driver ?? new EnvConfigDriver();
    }

    get(key: string): EnvironmentVariable {
        return this.driver.get(key);
    }

    // Method to get interval configurations, assuming intervals are known
    getIntervalConfig(interval: Interval): IntervalConfig {
        return this.driver.getIntervalConfig(interval)
    }

    validateIntervalConfig(intervalConfig: IntervalConfig): void {
        this.driver.validateIntervalConfig(intervalConfig)
    }
}




