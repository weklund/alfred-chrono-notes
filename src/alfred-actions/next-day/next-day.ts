import alfy from 'alfy';
import open from "open";
import {
    createTemplatedFile,
    DateUnit,
    doesFileExist,
    EnvironmentVariable,
    formatDayDate,
    resolveFileDateFormatPath,
    validateExistingEnvVar,
} from '../../utils/utils.js';
import {DateTime} from "luxon";


// Write a function that manually reformats a Date object to show this format 'yyyy mm dd dddd'
// If the month is a single digit, make sure to add a 0 before it to make it 2 digits
// const formatDate = (date: Date) => `${date.getFullYear()} ${date.getMonth() + 1} ${date.getDate()} ${DAYS[date.getDay()]}`

// obsidian://advanced-uri?vault=Personal&filepath=999-Planner%252FDailyPlans%252F2024-01-22%2520Monday.md
// obsidian://open?vault=Personal&file=999-Planner%2FDailyPlans%2F2024-01-22%20Monday
// obsidian://open?vault=Personal&file=2024-1-22 Monday.md

// 0. Get env vars:
const OBSIDIAN_VAULT_NAME: string | undefined = process.env.OBSIDIAN_VAULT_NAME
validateExistingEnvVar(OBSIDIAN_VAULT_NAME, 'Obsidian Vault Name EnvVar')

const DAILY_PATH: EnvironmentVariable = process.env.DAILY_PATH
validateExistingEnvVar(DAILY_PATH, 'Daily Note Folder')

const DAILY_PATH_FORMAT: EnvironmentVariable = process.env.DAILY_PATH_FORMAT
validateExistingEnvVar(DAILY_PATH_FORMAT, 'Daily Note Folder')

const DAILY_TEMPLATE_PATH: EnvironmentVariable = process.env.DAILY_TEMPLATE_PATH
validateExistingEnvVar(DAILY_TEMPLATE_PATH, 'Daily Note Template Folder')

// 1. Get next day
let day = DateTime.now()

// 2. Resolve full path
const full_path = resolveFileDateFormatPath(DAILY_PATH as string, day, DateUnit.DAY, DAILY_PATH_FORMAT as string)

console.log(`Full Path: ${full_path}`)

// 3. Check if file exists
if (!doesFileExist(full_path)){

    // 3.a Create Templated file
    createTemplatedFile(full_path, DAILY_TEMPLATE_PATH as string)
}

// 4. Open file
const OBSIDIAN_NOTE_URI = `obsidian://open?vault=Personal&file=${formatDayDate(day)}.md`

try {
    open(OBSIDIAN_NOTE_URI);
} catch (e: any) {
    alfy.log(`${e}`);
}
