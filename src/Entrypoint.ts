import open from "open";
import {validateExistingEnvVar} from "./Utils/CommonUtils.js";
import {ConfigProvider, IConfigProvider} from "./Utils/Config/ConfigProvider.js";
import {parseChronoNoteArg, ChronoNote} from "./Utils/Chrono/ChronoNote.js";
import {FileProvider, IFileProvider} from "./Utils/File/FileProvider.js";
import {ObsidianOpenNoteException} from "./Exceptions/ObsidianOpenNoteException.js";

// TODO:  Check installation of Obsidian, and Obsidian Periodic Notes plugin


/**
 *
 */
export class Entrypoint {
    private readonly configProvider: IConfigProvider;
    private readonly fileProvider: IFileProvider

    constructor(
        configProvider: IConfigProvider,
        fileProvider: IFileProvider,
    ) {
        this.configProvider = configProvider;
        this.fileProvider = fileProvider
    }

    /**
     *
     */
    public async handle() {
        console.info("Begin Entrypoint handle flow")
        // 1. Retrieve env vars:
        const arg = process.argv[2]
        console.info(`Passed in argv: ${arg}`)

        // 2. Parse arg and set ChronoNote context
        const chronoTypeInput = parseChronoNoteArg(arg)
        console.info(`Parsed argv with interval as ${chronoTypeInput.interval} and ordinal as ${chronoTypeInput.ordinal}`)
        const chronoNote = new ChronoNote(chronoTypeInput)

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
            await new Promise(() => {
                void open(OBSIDIAN_NOTE_URI)
            });

        } catch (e: unknown) {
            throw new ObsidianOpenNoteException(e as string)
        }
    }
}

// Factory function for entrypoint
export function createEntrypoint(
    configProvider: IConfigProvider,
    fileProvider: IFileProvider,
): Entrypoint {
    return new Entrypoint(configProvider, fileProvider);
}

const main = createEntrypoint(
    new ConfigProvider(),
    new FileProvider()
);

await main.handle();
