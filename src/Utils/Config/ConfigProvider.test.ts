import { ConfigProvider, IntervalConfig } from "./ConfigProvider.js";
import { Interval } from "../Chrono/ChronoNote.js";
import { MissingConfigurationException } from "../../Exceptions/MissingConfigurationException.js";
import { EnvConfigDriver } from "./drivers/EnvConfigDriver.js";

jest.mock("./drivers/EnvConfigDriver", () => {
  return {
    EnvConfigDriver: jest.fn().mockImplementation(() => {
      return {
        get: jest.fn().mockImplementation((key: string) => key + "_value"),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        getIntervalConfig: jest
          .fn()
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          .mockImplementation((interval: Interval) => ({
            // eslint-disable-next-line sonarjs/no-duplicate-string
            FILE_FORMAT: "yyyy-MM-DD",
            // eslint-disable-next-line sonarjs/no-duplicate-string
            FOLDER_PATH: "path/to/folder",
            // eslint-disable-next-line sonarjs/no-duplicate-string
            TEMPLATE_PATH: "path/to/template",
          })),
        validateIntervalConfig: jest
          .fn()
          .mockImplementation((intervalConfig: IntervalConfig) => {
            if (
              !intervalConfig.FOLDER_PATH ||
              !intervalConfig.FILE_FORMAT ||
              !intervalConfig.TEMPLATE_PATH
            ) {
              throw new MissingConfigurationException("Invalid configuration");
            }
          }),
      };
    }),
  };
});

describe("ConfigProvider", () => {
  let configProvider: ConfigProvider;

  describe("constructor", () => {
    it("should create a ConfigProvider instance", () => {
      configProvider = new ConfigProvider(new EnvConfigDriver());
      expect(configProvider).toBeInstanceOf(ConfigProvider);
    });

    it("should call the EnvConfigDriver constructor", () => {
      const EnvConfigDriverMock = jest.mocked(EnvConfigDriver);
      configProvider = new ConfigProvider(new EnvConfigDriver());
      expect(EnvConfigDriverMock).toHaveBeenCalled();
    });

    it("should call the constructor without any parameters", () => {
      const EnvConfigDriverMock = jest.mocked(EnvConfigDriver);
      configProvider = new ConfigProvider();
      expect(EnvConfigDriverMock).toHaveBeenCalled();
    });
  });

  describe("get method", () => {
    // Use the mocked EnvConfigDriver
    configProvider = new ConfigProvider(new EnvConfigDriver());

    it("should return the correct environment variable", () => {
      const key = "TEST_KEY";
      const expectedValue = key + "_value";

      expect(configProvider.get(key)).toEqual(expectedValue);
    });
  });

  describe("getIntervalConfig method", () => {
    // Use the mocked EnvConfigDriver
    configProvider = new ConfigProvider(new EnvConfigDriver());

    it("should return the correct interval config", () => {
      const interval: Interval = Interval.Daily;
      const expectedConfig = {
        FILE_FORMAT: "yyyy-MM-DD",
        FOLDER_PATH: "path/to/folder",
        TEMPLATE_PATH: "path/to/template",
      };
      expect(configProvider.getIntervalConfig(interval)).toEqual(
        expectedConfig,
      );
    });
  });

  describe("validateIntervalConfig method", () => {
    // Use the mocked EnvConfigDriver
    configProvider = new ConfigProvider(new EnvConfigDriver());

    it("should call validate on the driver with the correct config", () => {
      const invalidConfig = {
        FILE_FORMAT: "yyyy-MM-DD",
        FOLDER_PATH: "", // Invalid because it's empty
        TEMPLATE_PATH: "path/to/template",
      };
      expect(() =>
        configProvider.validateIntervalConfig(invalidConfig),
      ).toThrow("Invalid configuration");
    });
  });
});
