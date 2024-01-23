import alfy from 'alfy';
import open from "open";
import { createTemplatedFile, DateUnit, doesFileExist, formatWeekDate, resolveFileDateFormatPath, validateExistingEnvVar, } from '../../utils/utils.js';
// Write a function that manually reformats a Date object to show this format 'yyyy mm dd dddd'
// If the month is a single digit, make sure to add a 0 before it to make it 2 digits
// const formatDate = (date: Date) => `${date.getFullYear()} ${date.getMonth() + 1} ${date.getDate()} ${DAYS[date.getDay()]}`
// obsidian://advanced-uri?vault=Personal&filepath=999-Planner%252FDailyPlans%252F2024-01-22%2520Monday.md
// obsidian://open?vault=Personal&file=999-Planner%2FDailyPlans%2F2024-01-22%20Monday
// obsidian://open?vault=Personal&file=2024-1-22 Monday.md
// obsidian://open?vault=Personal&file=2024 01 22 Monday.md
// 0. Get env vars:
const OBSIDIAN_VAULT_NAME = process.env.OBSIDIAN_VAULT_NAME;
validateExistingEnvVar(OBSIDIAN_VAULT_NAME, 'Obsidian Vault Name EnvVar');
const WEEKLY_PATH = process.env.WEEKLY_PATH;
validateExistingEnvVar(WEEKLY_PATH, 'Weekly Note Folder');
const WEEKLY_PATH_FORMAT = process.env.WEEKLY_PATH;
validateExistingEnvVar(WEEKLY_PATH_FORMAT, 'Weekly Note Folder');
const WEEKLY_TEMPLATE_PATH = process.env.WEEKLY_TEMPLATE_PATH;
validateExistingEnvVar(WEEKLY_TEMPLATE_PATH, 'Weekly Note Template Folder');
// 1. Get next week
let day = new Date();
day.setDate(day.getDate() + 7);
// 2. Resolve full path
const full_path = resolveFileDateFormatPath(WEEKLY_PATH, day, DateUnit.WEEK, WEEKLY_PATH_FORMAT);
console.log(`Full Path: ${full_path}`);
// 3. Check if file exists
if (!doesFileExist(full_path)) {
    // 3.a Create Templated file
    createTemplatedFile(full_path, WEEKLY_TEMPLATE_PATH);
}
// 4. Open file
const OBSIDIAN_NOTE_URI = `obsidian://open?vault=Personal&file=${formatWeekDate(day)}.md`;
try {
    open(OBSIDIAN_NOTE_URI);
}
catch (e) {
    alfy.log(`${e}`);
}
