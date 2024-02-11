import * as fs from "fs";
import path from "path";
import {InvalidFilePathSchemaException} from "../../Exceptions/InvalidFilePathSchemaException.js";
import {FileDoesNotExistException} from "../../Exceptions/FileDoesNotExistException.js";
import {PathNotFileException} from "../../Exceptions/PathNotFileException.js";

export interface IFileHelper {
    readTemplate: (filePath: string) => string,
    doesFileExist: (filePath: string) => boolean,
    resolveHomePath: (path: string) => string,
    checkIfFileExists: (filePath: string) => void,
}

export class FileHelper implements IFileHelper {
    private driver: typeof fs;

    constructor() {
        this.driver = fs
    }

    /**
     * Get the full path to a file using the correct date format
     *
     * TODO: Replace default argument after exhaustive data formats handled
     *
     * @param directoryPath {string}
     * @param formattedDate {string}
     * @returns {string}
     */
    resolveNoteFullPath(directoryPath: string, formattedDate: string): string {
        return `${path.join(this.resolveHomePath(directoryPath), formattedDate)}.md`
    }

    /**
     * A function that adds the entire path if not provided
     *
     * @param filepath {string}
     */
    resolveHomePath(filepath: string): string {
        if (filepath.startsWith("~") && process.env.HOME) {
            return path.join(process.env.HOME, filepath.slice(1));
        }
        return filepath;
    }

    /**
     * Function that checks if a file exists or not
     *
     * @param filePath {string}
     * @returns {boolean}
     */
    doesFileExist(filePath: string): boolean {
        const path = this.resolveHomePath(filePath);

        return this.driver.existsSync(path) && this.driver.statSync(path).isFile()
    }

    /**
     * Check if path is valid.
     *
     * Provides a security check to prevent an attacker to execute arbitrary code.
     *
     * Mitigates the ESlint rule security/detect-non-literal-fs-filename
     * @link https://github.com/eslint-community/eslint-plugin-security/blob/main/docs/rules/detect-non-literal-fs-filename.md
     *
     * @param path
     * @returns {boolean}
     */
    isValidPathSchema(path: string): boolean {
        // TODO: Remove after through testing
        const regex = /^[a-zA-Z0-9][a-zA-Z0-9._/-]*$/;

        // Get current mac user from node env or os
        // const regex = /^(?:\/Users\/[a-zA-Z0-9_-]+\/)?[a-zA-Z0-9._/-]*$/;

        return regex.test(path);
    }

    /**
     * Check if file exists in vault.
     *
     * @param filePath {string}
     * @throws {InvalidFilePathSchemaException} if the provided path is not valid
     * @throws {FileDoesNotExistException} if the provided path does not exist
     * @throws {PathNotFileException} if the provided path is not a file
     */
    checkIfFileExists(filePath: string): void {
        const path = this.resolveHomePath(filePath);

        if(!this.isValidPathSchema(path)) {
            throw new InvalidFilePathSchemaException(`Invalid path schema: ${path}`)
        }

        if (!this.driver.existsSync(path)) {
            throw new FileDoesNotExistException(`File does not exist at ${path}`)
        }

        if (!this.driver.statSync(path).isFile()) {
            throw new PathNotFileException(`Path is not a file at ${path}`)
        }
    }

    /**
     *
     * @param filePath
     * @throws {Error} if the file cannot be read.
     */
    readTemplate(filePath: string): string {
        let templateFileContent: string = ''

        try {
            templateFileContent = this.driver.readFileSync(filePath, 'utf8')
        } catch (e) {
            throw new Error(`Could not read template file at ${filePath}`)
        }

        return templateFileContent
    }

}
