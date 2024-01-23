/**
 * @class PathNotFileException
 * @description This exception is thrown when a path is directory
 * @extends Error
 * @param {string} message - The error message.
 * @param {string} path - The path that is a directory
 */
export class PathNotFileException extends Error {
    private path: string;

    constructor(message: string, path: string) {
        super(message);
        this.name = 'PathNotFileException';
        this.message = message;
        this.path = path;
    }
}
