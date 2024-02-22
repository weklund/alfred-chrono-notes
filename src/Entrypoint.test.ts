import open from "open";
import { DateTime } from "luxon";
import { ConfigProvider, IntervalConfig } from "./Utils/Config/ConfigProvider";
import { FileProvider } from "./Utils/File/FileProvider";
import { createEntrypoint, Entrypoint } from "./Entrypoint";
import { MissingConfigurationException } from "./Exceptions/MissingConfigurationException";

jest.mock("open");

jest.mock("./Utils/Config/ConfigProvider", () => {
  return {
    ConfigProvider: jest.fn().mockImplementation(() => {
      return {
        get: jest.fn().mockImplementation((key: string) => key + "_value"),
        getIntervalConfig: jest.fn().mockImplementation(() => ({
          FILE_FORMAT: "yyyy-MM-dd cccc",
          FOLDER_PATH: "mockPath",
          TEMPLATE_PATH: "mockTemplatePath",
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

jest.mock("./Utils/File/FileProvider");

describe("Entrypoint", () => {
  let entrypoint: Entrypoint;

  let configProviderMock: ConfigProvider;
  let fileProviderMock: FileProvider;

  const openMock = open as jest.Mocked<typeof open>;

  describe("constructor", () => {
    it("should instantiate correctly", () => {
      const entrypoint = createEntrypoint(configProviderMock, fileProviderMock);
      expect(entrypoint).toBeInstanceOf(Entrypoint);
    });

    it("should create an instance of Entrypoint", () => {
      entrypoint = new Entrypoint(new ConfigProvider(), new FileProvider());

      expect(entrypoint).toBeInstanceOf(Entrypoint);
    });

    it("should call the configProvider constructor", () => {
      const configProviderMock = jest.mocked(ConfigProvider);
      const fileProviderMock = jest.mocked(FileProvider);
      entrypoint = new Entrypoint(new ConfigProvider(), new FileProvider());
      expect(configProviderMock).toHaveBeenCalled();
      expect(fileProviderMock).toHaveBeenCalled();
    });
  });

  describe("handle method", () => {
    let entrypoint: Entrypoint;

    const originalArgv = process.argv;

    beforeEach(() => {
      entrypoint = createEntrypoint(new ConfigProvider(), new FileProvider());

      process.argv = [...originalArgv]; // own shallow copy
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should execute handle flow correctly", () => {
      // Setup
      process.argv[3] = "CurrentDaily";
      const expectedDate = DateTime.local(2022, 10, 10);
      const expectedStringDate = "2022-10-10 Monday";

      // Execute
      entrypoint = createEntrypoint(
        new ConfigProvider(),
        new FileProvider(),
        expectedDate,
      );
      entrypoint.handle();

      // Verify
      expect(openMock).toHaveBeenCalledTimes(1);
      expect(openMock).toHaveBeenCalledWith(
        `obsidian://open?vault=OBSIDIAN_VAULT_NAME_value&file=${expectedStringDate}.md`,
      );
    });
  });
});
