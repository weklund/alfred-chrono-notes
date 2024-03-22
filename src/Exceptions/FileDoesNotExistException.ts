/**
 * @description This exception is thrown when a file does not exist.
 * @param {string} message - The error message.
 */
export class FileDoesNotExistException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FileDoesNotExistException";
    this.message = message;
    console.error(`${this.name}: ${this.message}`);
  }
}
