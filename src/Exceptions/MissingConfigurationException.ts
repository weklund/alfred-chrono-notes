/**
 * @class MissingConfigurationException
 * @description This exception is called when configuration is missing, whether it's from a plugin, or an environment variable
 * @extends Error
 * @param {string} message - The error message.
 */
export class MissingConfigurationException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MissingConfigurationException";
    this.message = message;
    console.error(`${this.name}: ${this.message}`);
  }
}
