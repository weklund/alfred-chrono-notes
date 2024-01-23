/**
 * @class PathNotFileException
 * @description This exception is thrown when a path is directory
 * @extends Error
 * @param {string} message - The error message.
 * @param {string} path - The path that is a directory
 */
export class PathNotFileException extends Error {
    constructor(message, path) {
        super(message);
        this.name = 'PathNotFileException';
        this.message = message;
        this.path = path;
    }
}
