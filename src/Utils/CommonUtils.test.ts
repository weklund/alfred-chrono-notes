import { EnvironmentVariable } from "./Config/ConfigProvider";
import {
  isEnvVarSet,
  parseChronoNoteArg,
  validateExistingEnvVar,
} from "./CommonUtils";
import { MissingConfigurationException } from "../Exceptions/MissingConfigurationException";
import { Interval, Ordinal } from "./Chrono/ChronoNote";
import { InvalidEntrypointArguments } from "../Exceptions/InvalidEntrypointArguments";

describe("Common Utilities", () => {
  describe("parseChronoNoteArg function", () => {
    it("should parse valid args correctly", () => {
      const input = "CurrentDaily";
      const expected = {
        interval: Interval.Daily,
        ordinal: Ordinal.Current,
      };
      expect(parseChronoNoteArg(input)).toEqual(expected);
    });

    it("throws InvalidEntrypointArguments for invalid args", () => {
      const input = "InvalidArgs";
      expect(() => parseChronoNoteArg(input)).toThrow(
        InvalidEntrypointArguments,
      );
    });
  });

  describe("isEnvVarSet", () => {
    it("should return true if the provided Environment Variable is set", () => {
      // Setup
      const process_env_TEST_ENV_VAR: EnvironmentVariable = "hello world";
      // Verify
      expect(isEnvVarSet(process_env_TEST_ENV_VAR)).toBeTruthy();
    });

    it("should return false if the provided Environment Variable is undefined", () => {
      // Setup
      const process_env_TEST_ENV_VAR: EnvironmentVariable = undefined;
      // Verify
      expect(isEnvVarSet(process_env_TEST_ENV_VAR)).toBeFalsy();
    });

    it("should return false if the provided Environment Variable is null", () => {
      // Setup
      const process_env_TEST_ENV_VAR: EnvironmentVariable = null;
      // Verify
      expect(isEnvVarSet(process_env_TEST_ENV_VAR)).toBeFalsy();
    });

    it("should return false if the provided Environment Variable is empty string", () => {
      // Setup
      const process_env_TEST_ENV_VAR: EnvironmentVariable = "";
      // Verify
      expect(isEnvVarSet(process_env_TEST_ENV_VAR)).toBeFalsy();
    });
  });

  describe("validateExistingEnvVar", () => {
    it("should throw MissingConfigurationException when Environment Variable is not set", () => {
      const process_env_NULL_ENV_VAR: EnvironmentVariable = undefined;

      expect(() => {
        validateExistingEnvVar(process_env_NULL_ENV_VAR);
      }).toThrow(MissingConfigurationException);
    });
  });
});
