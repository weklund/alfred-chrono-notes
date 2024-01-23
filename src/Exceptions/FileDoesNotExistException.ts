/**
 * @class FileDoesNotExistException
 * @description This exception is thrown when a file does not exist.
 * @extends Error
 * @param {string} message - The error message.
 * @param {string} path - The path of the file that does not exist.
 */
export class FileDoesNotExistException extends Error {
    constructor(message: string, path: string) {
        super(message);
        this.name = 'FileDoesNotExistException';
        this.message = message;
    }
}
