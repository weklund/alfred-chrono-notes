import { EnvConfigDriver } from './EnvConfigDriver.js'
import { isEnvVarSet } from '../../CommonUtils.js'
import { MissingConfigurationException } from '../../../Exceptions/MissingConfigurationException.js'
import { Interval } from '../../Chrono/ChronoNote.js'

jest.mock('../../CommonUtils', () => ({
  isEnvVarSet: jest.fn(),
}))

const getValidTestConfig = () => ({
  FILE_FORMAT: 'YYYY-MM-DD',
  FOLDER_PATH: '/var/logs',
  TEMPLATE_PATH: '/templates/daily.md',
})

describe('EnvConfigDriver', () => {
  let envConfigDriver: EnvConfigDriver

  beforeEach(() => {
    envConfigDriver = new EnvConfigDriver()
    // Reset process.env to a known state before each test
    process.env = {}
  })

  describe('get function', () => {
    it('should return correct environment variable value', () => {
      const testKey = 'TEST_KEY'
      const testValue = 'test_value'
      process.env[testKey] = testValue

      expect(envConfigDriver.get(testKey)).toEqual(testValue)
    })
  })

  describe('getIntervalConfig function', () => {
    it('should return correct interval configuration', () => {
      const interval = 'daily'
      const config = getValidTestConfig()

      process.env.DAILY_FILE_FORMAT = config.FILE_FORMAT
      process.env.DAILY_PATH = config.FOLDER_PATH
      process.env.DAILY_TEMPLATE_PATH = config.TEMPLATE_PATH

      expect(envConfigDriver.getIntervalConfig(interval)).toEqual(config)
    })

    it('should return empty string when environment variables are not set', () => {
      const interval = Interval.Daily

      const config = {
        FILE_FORMAT: undefined,
        FOLDER_PATH: undefined,
        TEMPLATE_PATH: undefined,
      }

      process.env.DAILY_FILE_FORMAT = config.FILE_FORMAT
      process.env.DAILY_PATH = config.FOLDER_PATH
      process.env.DAILY_TEMPLATE_PATH = config.TEMPLATE_PATH

      expect(envConfigDriver.getIntervalConfig(interval)).toEqual({
        FILE_FORMAT: '',
        FOLDER_PATH: '',
        TEMPLATE_PATH: '',
      })
    })
  })

  describe('validateIntervalConfig function', () => {
    it('should throw when invalid', () => {
      const intervalConfig = {
        FILE_FORMAT: '',
        FOLDER_PATH: '/var/logs',
        TEMPLATE_PATH: '',
      }

      // Mock isEnvVarSet to simulate missing environment variables
      ;(isEnvVarSet as jest.Mock).mockImplementation(
        (value: string | undefined) => Boolean(value),
      )

      expect(() =>
        envConfigDriver.validateIntervalConfig(intervalConfig),
      ).toThrow(MissingConfigurationException)
    })

    it('should do nothing when valid', () => {
      const config = getValidTestConfig()

      // Mock isEnvVarSet to simulate all environment variables present
      ;(isEnvVarSet as jest.Mock).mockImplementation(
        (value: string | undefined) => Boolean(value),
      )

      expect(() => envConfigDriver.validateIntervalConfig(config)).not.toThrow()
    })
  })
})
