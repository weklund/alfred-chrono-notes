import {ConfigDriver, EnvironmentVariable} from "../ConfigProvider";

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
}
