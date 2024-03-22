/**
 * @description This exception is thrown when an attempted file read could not be complete.
 * @param {string} message - The error message.
 */
export class FatalReadFileSyncException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FatalReadFileSyncException";
    this.message = message;
    console.error(`${this.name}: ${this.message}`);
  }
}
