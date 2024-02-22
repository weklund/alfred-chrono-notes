import open from "open"
import {DateTime} from "luxon";
import {parseChronoNoteArg, validateExistingEnvVar} from "./Utils/CommonUtils.js"
import {IConfigProvider} from "./Utils/Config/ConfigProvider.js"
import {IFileProvider} from "./Utils/File/FileProvider.js"
import {ChronoNote} from "./Utils/Chrono/ChronoNote.js"

// TODO:  Check installation of Obsidian, and Obsidian Periodic Notes plugin

/**
 * @class Entrypoint
 *
 * @description Handles the entrypoint logic for the Chrono Notes Alfred Workflow
 *
 * @property {IConfigProvider}
 * @property {IFileProvider}
 */
export class Entrypoint {
    private readonly configProvider: IConfigProvider
    private readonly fileProvider: IFileProvider
    private readonly dateTime: DateTime;

    /**
     * Entrypoint constructor
     *
     * @param {IConfigProvider} configProvider
     * @param {IFileProvider} fileProvider
     * @param {DateTime} customDateTime
     */
    constructor(
        configProvider: IConfigProvider,
        fileProvider: IFileProvider,
        customDateTime: DateTime = DateTime.now()
    ) {
        this.configProvider = configProvider
        this.fileProvider = fileProvider
        this.dateTime = customDateTime
    }

    /**
     * Handles the entrypoint logic for the Chrono Notes Alfred Workflow
     *
     * Execute flow:
     *  1. Parses command line arguments
     *  2. Set up the ChronoNote context
     *  3. Check that obsidian vault name is set and exists
     *  4. Retrieve required ChronoNote config and check if valid
     *  5. Get the obsidian file name for the ChronoNote
     *  6. Get the full path for the ChronoNote
     *  7. Check if file exists
     *   7.a If it doesn't then create the ChronoNote based on provided template path
     *  8. Open the ChronoNote in Obsidian
     *
     * @throws InvalidEntrypointArguments
     * @throws ObsidianOpenNoteException
     * @throws MissingConfigurationException
     * @throws FileAlreadyExistsException
     * @throws FatalReadFileSyncException
     */
    public handle() {
        console.log("Begin Entrypoint handle flow")
        // 1. Parses command line arguments:
        const arg = process.argv[3]
        console.log(`Passed in argv: ${arg}`)

        // 2. Parse arg and set ChronoNote context
        const chronoTypeInput = parseChronoNoteArg(arg)
        console.info(`Parsed argv with interval as ${chronoTypeInput.interval} and ordinal as ${chronoTypeInput.ordinal}`)
        const chronoNote = new ChronoNote(
            chronoTypeInput,
            this.fileProvider,
            this.dateTime
        )

        // 3. Check that obsidian vault name is set and exists
        const OBSIDIAN_VAULT_NAME = this.configProvider.get('OBSIDIAN_VAULT_NAME')
        validateExistingEnvVar(OBSIDIAN_VAULT_NAME, 'Obsidian Vault Name')

        // 4. Retrieve required ChronoNote config and check if valid
        const intervalVars = this.configProvider.getIntervalConfig(chronoNote.getInterval())
        this.configProvider.validateIntervalConfig(intervalVars)

        // 5. Get the obsidian file name for the ChronoNote
        const fileName = `${chronoNote.formatDate(intervalVars.FILE_FORMAT)}.md`
        console.info(`File Name: ${fileName}`)

        // 6. Get the full path for the ChronoNote
        const fullPath = this.fileProvider.resolveNoteFullPath(
            intervalVars.FOLDER_PATH,
            chronoNote.formatDate(intervalVars.FILE_FORMAT)
        )
        console.info(`Full Path: ${fullPath}`)

        // 7. Check if file exists
        if (!this.fileProvider.doesFileExist(fullPath)){
            console.info('File does not exist, creating one from provided template')

            // 7.a If it doesn't then create the ChronoNote based on provided template path
            this.fileProvider.createTemplatedNote(
                fullPath ,
                intervalVars.TEMPLATE_PATH,
            )
        } else {
            console.info('File already exists')
        }

        // 8. Open file
        const OBSIDIAN_NOTE_URI = `obsidian://open?vault=${OBSIDIAN_VAULT_NAME}&file=${fileName}`

        try {
            console.info('Attempting to open file in Obsidian')
            void open(OBSIDIAN_NOTE_URI)

        } catch (e: unknown) {
            throw new Error(e as string)
        }
    }
}

// Factory function for entrypoint
export function createEntrypoint(
    configProvider: IConfigProvider,
    fileProvider: IFileProvider,
    customDateTime: DateTime = DateTime.now()
): Entrypoint {
    return new Entrypoint(
        configProvider,
        fileProvider,
        customDateTime
    )
}
