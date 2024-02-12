import {EnvironmentVariable} from "./Config/ConfigProvider.js";
import {isEnvVarSet, validateExistingEnvVar} from "./CommonUtils.js";
import {MissingConfigurationException} from "../Exceptions/MissingConfigurationException.js";

describe("Common Utility Unit Tests", () => {
    describe("isEnvVarSet", () => {
        it("should return true if the provided Environment Variable is set", () => {
            // Setup
            const process_env_TEST_ENV_VAR: EnvironmentVariable = "hello world";
            // Verify
            expect(isEnvVarSet(process_env_TEST_ENV_VAR)).toBeTruthy()
        })

        it("should return false if the provided Environment Variable is undefined", () => {
            // Setup
            const process_env_TEST_ENV_VAR: EnvironmentVariable = undefined;
            // Verify
            expect(isEnvVarSet(process_env_TEST_ENV_VAR)).toBeFalsy()
        })

        it("should return false if the provided Environment Variable is null", () => {
            // Setup
            const process_env_TEST_ENV_VAR: EnvironmentVariable = null;
            // Verify
            expect(isEnvVarSet(process_env_TEST_ENV_VAR)).toBeFalsy()
        })

        it("should return false if the provided Environment Variable is empty string", () => {
            // Setup
            const process_env_TEST_ENV_VAR: EnvironmentVariable = "";
            // Verify
            expect(isEnvVarSet(process_env_TEST_ENV_VAR)).toBeFalsy()
        })
    })

    describe("validateExistingEnvVar", () => {
        it("should throw MissingConfigurationException when Environment Variable is not set", () => {
            const process_env_NULL_ENV_VAR: EnvironmentVariable = undefined;

            expect(() => {
                validateExistingEnvVar(process_env_NULL_ENV_VAR)
            }).toThrow(MissingConfigurationException)
        })
    })
})
