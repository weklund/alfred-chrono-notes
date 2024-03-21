/**
 * @class PathNotFileException
 * @description This exception is thrown when a path is directory.
 * @param {string} message - The error message.
 * @augments Error
 */
export class PathNotFileException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PathNotFileException";
    this.message = message;
    console.error(`${this.name}: ${message}`);
  }
}
