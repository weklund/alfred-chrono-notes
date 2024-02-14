// Mocking the ConfigDriver
import {ConfigProvider, IntervalConfig} from "./ConfigProvider";
import {Interval} from "../Chrono/ChronoNote";
import {MissingConfigurationException} from "../../Exceptions/MissingConfigurationException";
import {EnvConfigDriver} from "./drivers/EnvConfigDriver";

jest.mock('./drivers/EnvConfigDriver', () => {
    return {
        EnvConfigDriver: jest.fn().mockImplementation(() => {
            return {
                get: jest.fn().mockImplementation((key: string) => key + '_value'),
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                getIntervalConfig: jest.fn().mockImplementation((interval: Interval) => ({
                    // eslint-disable-next-line sonarjs/no-duplicate-string
                    FILE_FORMAT: 'yyyy-MM-DD',
                    // eslint-disable-next-line sonarjs/no-duplicate-string
                    FOLDER_PATH: 'path/to/folder',
                    // eslint-disable-next-line sonarjs/no-duplicate-string
                    TEMPLATE_PATH: 'path/to/template'
                })),
                validateIntervalConfig: jest.fn().mockImplementation((intervalConfig: IntervalConfig) => {
                    if (!intervalConfig.FOLDER_PATH || !intervalConfig.FILE_FORMAT || !intervalConfig.TEMPLATE_PATH) {
                        throw new MissingConfigurationException('Invalid configuration');
                    }
                }),
            };
        })
    };
});

describe("ConfigProvider", () => {
    let configProvider: ConfigProvider;

    beforeEach(() => {
        // Use the mocked EnvConfigDriver
        configProvider = new ConfigProvider(new EnvConfigDriver());
    });

    describe('get method', () => {
        it('should return the correct environment variable', () => {
            const key = 'TEST_KEY'
            const expectedValue = key + '_value'

            expect(configProvider.get(key)).toEqual(expectedValue)
        });
    });

    describe('getIntervalConfig method', () => {
        it('should return the correct interval config', () => {
            const interval: Interval = Interval.Daily
            const expectedConfig = {
                FILE_FORMAT: 'yyyy-MM-DD',
                FOLDER_PATH: 'path/to/folder',
                TEMPLATE_PATH: 'path/to/template'
            }
            expect(configProvider.getIntervalConfig(interval)).toEqual(expectedConfig)

        });
    });

    describe('validateIntervalConfig method', () => {
        it('should call validate on the driver with the correct config', () => {
            const invalidConfig = {
                FILE_FORMAT: 'yyyy-MM-DD',
                FOLDER_PATH: '', // Invalid because it's empty
                TEMPLATE_PATH: 'path/to/template'
            };
            expect(() => configProvider.validateIntervalConfig(invalidConfig)).toThrow('Invalid configuration');
        });
    });
})