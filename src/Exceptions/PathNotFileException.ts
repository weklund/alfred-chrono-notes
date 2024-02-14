/**
 * @class PathNotFileException
 * @description This exception is thrown when a path is directory
 * @extends Error
 * @param {string} message - The error message.
 */
export class PathNotFileException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'PathNotFileException';
        this.message = message;
        console.error(`${this.name}: ${message}`);
    }
}
