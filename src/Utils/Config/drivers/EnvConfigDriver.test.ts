import {EnvConfigDriver} from "./EnvConfigDriver";
import {isEnvVarSet} from "../../CommonUtils";
import {MissingConfigurationException} from "../../../Exceptions/MissingConfigurationException";


jest.mock('../../CommonUtils', () => ({
    isEnvVarSet: jest.fn(),
}));

describe("EnvConfigDriver", () => {
    let envConfigDriver: EnvConfigDriver;

    beforeEach(() => {
        envConfigDriver = new EnvConfigDriver();
        // Reset process.env to a known state before each test
        process.env = {};
    });
    
    describe("get function", () => {
        it('should return correct environment variable value', () => {
            const testKey = 'TEST_KEY';
            const testValue = 'test_value';
            process.env[testKey] = testValue;

            expect(envConfigDriver.get(testKey)).toEqual(testValue);
        });    
    })
    
    describe("getIntervalConfig function", () => {
        it('should return correct interval configuration', () => {
            const interval = 'daily';
            const config = {
                FILE_FORMAT: 'YYYY-MM-DD',
                FOLDER_PATH: '/var/logs',
                TEMPLATE_PATH: '/templates/daily.md',
            };
            process.env.DAILY_FILE_FORMAT = config.FILE_FORMAT;
            process.env.DAILY_PATH = config.FOLDER_PATH;
            process.env.DAILY_TEMPLATE_PATH = config.TEMPLATE_PATH;

            expect(envConfigDriver.getIntervalConfig(interval)).toEqual(config);
        });    
    })

    describe("validateIntervalConfig function", () => {
        it("should throw when invalid", () => {
            const intervalConfig = {
                FILE_FORMAT: '',
                FOLDER_PATH: '/var/logs',
                TEMPLATE_PATH: '',
            };

            // Mock isEnvVarSet to simulate missing environment variables
            (isEnvVarSet as jest.Mock).mockImplementation((value: string | undefined) => Boolean(value));

            expect(() => envConfigDriver.validateIntervalConfig(intervalConfig)).toThrow(MissingConfigurationException);
        })

        it("should do nothing when valid", () => {
            const intervalConfig = {
                FILE_FORMAT: 'YYYY-MM-DD',
                FOLDER_PATH: '/var/logs',
                TEMPLATE_PATH: '/templates/daily.md',
            };

            // Mock isEnvVarSet to simulate all environment variables present
            (isEnvVarSet as jest.Mock).mockImplementation((value: string | undefined) => Boolean(value));

            expect(() => envConfigDriver.validateIntervalConfig(intervalConfig)).not.toThrow();
        })
    })
    
})