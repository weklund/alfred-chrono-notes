/**
 * @class InvalidDateFormatException
 * @description This exception is called when the date format is invalid.
 * @extends Error
 * @param {string} message - The error message.
 */
export class InvalidDateFormatException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidDateFormatException';
        this.message = message;
    }
}
