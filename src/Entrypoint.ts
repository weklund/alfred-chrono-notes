import open from "open";
import {doesFileExist, createTemplatedFile, isEnvVarSet} from "./Utils/CommonUtils.js";
import {ConfigProvider, IntervalConfig} from "./Utils/Config/ConfigProvider.js";
import {parseChronoNoteArg, ChronoNote} from "./Utils/Chrono/ChronoNote.js";
import {MissingConfigurationException} from "./Exceptions/MissingConfigurationException";
import {FileHelper} from "./Utils/File/FileHelper";

// TODO:  Check installation of Obsidian, and Obsidian Periodic Notes plugin

/**
 * Check that the required interval config variables are set
 * Specifically checking 3 variables in {@link IntervalConfig}
 * If it's not set then throw {@link MissingConfigurationException}
 *
 * @param intervalVars
 */
export function validateConfig(intervalVars: IntervalConfig) {
    Object.keys(intervalVars).forEach((key) => {
        const typedKey = key as keyof IntervalConfig;

        if (!isEnvVarSet(intervalVars[typedKey])) {
            throw new MissingConfigurationException(`Missing environment variable: ${typedKey}`)
        }
    });
}

export async function handle() {
    console.log("Entrypoint handle flow")
    // 0. Get env vars:

    const arg = process.argv[2]

    console.log(arg)

    const chronoTypeInput = parseChronoNoteArg(arg)

    const configProvider = new ConfigProvider();

    const chronoNote = new ChronoNote(chronoTypeInput)

    const intervalVars = configProvider.getIntervalConfig(chronoNote.getInterval())

    validateConfig(intervalVars)

    const fileHelper = new FileHelper()

    const fullPath = fileHelper.resolveNoteFullPath(
        intervalVars.folderPath,
        chronoNote.formatDate(intervalVars.pathFormat)
    )

    if (!fileHelper.doesFileExist(fullPath)){

        // 3.a Create Templated file
        chronoNote(
            fullPath,
            intervalVars.templatePath,
        )
    }

    console.log(`Full Path: ${fullPath}`)

    // 4. Open file
    const OBSIDIAN_NOTE_URI = `obsidian://open?vault=${OBSIDIAN_VAULT_NAME}&file=${formatDayDate(day)}.md`

    try {
        await new Promise(() => {
            void open(OBSIDIAN_NOTE_URI)
        });

    } catch (e: unknown) {
        console.error(`${e as string}`);
    }
}

void handle()
