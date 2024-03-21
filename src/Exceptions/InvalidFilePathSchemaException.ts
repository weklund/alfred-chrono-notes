/**
 * @class InvalidFilePathSchemaException
 * @description This exception is called when the given file path is invalid.
 * @param {string} message - The error message.
 * @augments Error
 */
export class InvalidFilePathSchemaException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidFilePathSchemaException";
    this.message = message;
    console.error(`${this.name}: ${this.message}`);
  }
}
