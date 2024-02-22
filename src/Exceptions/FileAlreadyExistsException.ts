/**
 * @class FileAlreadyExistsException
 * @description This exception is thrown when a file already exists and it shouldn't.
 * @extends Error
 * @param {string} message - The error message.
 */
export class FileAlreadyExistsException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FileAlreadyExistsException";
    this.message = message;
    console.error(`${this.name}: ${this.message}`);
  }
}
