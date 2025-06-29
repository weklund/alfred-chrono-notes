/**
 * @description This exception is thrown when an attempted file write could not be complete.
 * @param {string} message - The error message.
 */
export class FatalWriteFileSyncException extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'FatalWriteFileSyncException'
    this.message = message
    console.error(`${this.name}: ${this.message}`)
  }
}
