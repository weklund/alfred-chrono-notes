import * as os from "os";
import * as fs from "fs";
import path from "path";
import { InvalidFilePathSchemaException } from "../../Exceptions/InvalidFilePathSchemaException.js";
import { FileDoesNotExistException } from "../../Exceptions/FileDoesNotExistException.js";
import { PathNotFileException } from "../../Exceptions/PathNotFileException.js";
import { FileAlreadyExistsException } from "../../Exceptions/FileAlreadyExistsException.js";
import { FatalReadFileSyncException } from "../../Exceptions/FatalReadFileSyncException.js";
import { FatalWriteFileSyncException } from "../../Exceptions/FatalWriteFileSyncException.js";

/**
 * Represents the interface of a {@link FileProvider}.
 *
 * Defines the interface that consuming classes would need when injecting a class of type {@link IFileProvider}.
 * @template readTemplate {string} returns the contents of the file.
 * @template doesFileExist {boolean} returns true if the file exists.
 * @template resolveHomePath {string} returns the full path to a file.
 * @template checkIfFileExists {void} checks if a file exists or not.
 * @template resolveNoteFullPath {string} returns the full path to a file using the correct date format.
 * @template createTemplatedNote {void} creates a file based on a template file.
 */
export interface IFileProvider {
  readTemplate: (filePath: string) => string;
  doesFileExist: (filePath: string) => boolean;
  resolveHomePath: (path: string) => string;
  checkIfFileExists: (filePath: string) => void;
  resolveNoteFullPath: (directoryPath: string, formattedDate: string) => string;
  createTemplatedNote: (filePath: string, templateFilePath: string) => void;
}

/**
 * @description This class implements the IFileProvider interface and provides functionality
 * for resolving file paths, checking file existence, and creating templated files.
 *
 * It supports a single file provider driver type, but can add more.
 */
export class FileProvider implements IFileProvider {
  // TODO:  Support more FileProvider driver types as needed

  /**
   * Get the full path to a file using the correct date format.
   * @param directoryPath - The provided relative path.
   * @param formattedDate - The formatted date string.
   * @returns - The full absolute path to a given file and formatted date string.
   */
  resolveNoteFullPath(directoryPath: string, formattedDate: string): string {
    return `${path.join(this.resolveHomePath(directoryPath), formattedDate)}.md`;
  }

  /**
   * A function that adds the entire path if not provided.
   * @param filepath - The provided relative path.
   * @returns - The full absolute path.
   */
  resolveHomePath(filepath: string): string {
    if (filepath.startsWith("~") && process.env.HOME) {
      return path.join(process.env.HOME, filepath.slice(1));
    }
    return filepath;
  }

  /**
   * Check if path is valid.
   *
   * Provides a security check to prevent an attacker to execute arbitrary code.
   * Checks the given path to make sure it's in the directory of the current OS user, and not any other or any system directories.
   *
   * Mitigates the ESlint rule security/detect-non-literal-fs-filename
   * {@link https://github.com/eslint-community/eslint-plugin-security/blob/main/docs/rules/detect-non-literal-fs-filename.md}.
   * @param path - The provided path to check.
   * @returns - True if the path is valid, false otherwise.
   */
  isValidPathSchema(path: string): boolean {
    const userInfo = os.userInfo();

    const regex = RegExp(`^(?=${userInfo.homedir})[a-zA-Z0-9._/ -]*$`);

    return regex.test(path);
  }

  /**
   * Function that checks if a file exists or not.
   * @param filePath - The provided path to check.
   * @returns - True if the file exists, false otherwise.
   */
  doesFileExist(filePath: string): boolean {
    const path = this.resolveHomePath(filePath);

    return fs.existsSync(path) && fs.statSync(path).isFile();
  }

  /**
   * Check if file exists in vault.
   * @param filePath  - The path to the file.
   * @throws {InvalidFilePathSchemaException} - If the provided path is not valid.
   * @throws {FileDoesNotExistException} - If the provided path does not exist.
   * @throws {PathNotFileException} - If the provided path is not a file.
   */
  checkIfFileExists(filePath: string): void {
    const path = this.resolveHomePath(filePath);

    if (!this.isValidPathSchema(path)) {
      throw new InvalidFilePathSchemaException(`Invalid path schema: ${path}`);
    }

    if (!fs.existsSync(path)) {
      throw new FileDoesNotExistException(`File does not exist at ${path}`);
    }

    if (!fs.statSync(path).isFile()) {
      throw new PathNotFileException(`Path is not a file at ${path}`);
    }
  }

  /**
   * Reads a file and returns the content.
   *
   * A markdown (.md) file that's used to define a user's Obsidian template.
   * @param filePath - The path to the file.
   * @returns The contents of the file.
   * @throws {Error} If the file cannot be read.
   */
  readTemplate(filePath: string): string {
    let templateFileContent: string = "";

    try {
      templateFileContent = fs.readFileSync(filePath, "utf8");
    } catch (e) {
      throw new FatalReadFileSyncException(
        `Could not read template file at ${filePath}`,
      );
    }

    return templateFileContent;
  }

  /**
   * Given a file path and valid templateFilePath, create a new file.
   * @param filePath - The path to the new file.
   * @param templateFilePath - The path to the template file.
   * @throws {FileDoesNotExistException}
   */
  createTemplatedNote(filePath: string, templateFilePath: string): void {
    // 1. Check that the provided filePath does not exist.
    if (this.doesFileExist(filePath)) {
      throw new FileAlreadyExistsException(
        `File already exists at ${filePath}`,
      );
    }

    // 2. Check if templateFilePath given is actually a file
    this.checkIfFileExists(templateFilePath);

    let templateFileContent = "";

    // 3. Fetch the template contents
    const fullTemplateFilePath = this.resolveHomePath(templateFilePath);

    try {
      templateFileContent = this.readTemplate(fullTemplateFilePath);
    } catch (e) {
      throw new FatalReadFileSyncException(
        `Could not read template file at ${fullTemplateFilePath}`,
      );
    }

    const fullFilePath = this.resolveHomePath(filePath);

    // 4. Create new file from template
    try {
      fs.writeFileSync(fullFilePath, templateFileContent);
    } catch (e) {
      throw new FatalWriteFileSyncException(
        `Could not create templated file at ${filePath}`,
      );
    }
  }
}
