/**
 * @description This exception is called when the date format is invalid.
 * @param {string} message - The error message.
 */
export class InvalidEntrypointArguments extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidEntrypointArguments";
    this.message = message;
    console.error(`${this.name}: ${this.message}`);
  }
}
