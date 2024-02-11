// import open from "open";
// import {
//     EnvironmentVariable,
//     createTemplatedFile,
//     DateUnit,
//     doesFileExist,
//     formatDayDate,
//     resolveFileDateFormatPath,
//     validateExistingEnvVar,
// } from "../../utils/utils.js";
// import {DateTime} from "luxon";
//
//
// // Write a function that manually reformats a Date object to show this format 'yyyy mm dd dddd'
// // If the month is a single digit, make sure to add a 0 before it to make it 2 digits
// // const formatDate = (date: Date) => `${date.getFullYear()} ${date.getMonth() + 1} ${date.getDate()} ${DAYS[date.getDay()]}`
//
// // obsidian://advanced-uri?vault=Personal&filepath=999-Planner%252FDailyPlans%252F2024-01-22%2520Monday.md
// // obsidian://open?vault=Personal&file=999-Planner%2FDailyPlans%2F2024-01-22%20Monday
// // obsidian://open?vault=Personal&file=2024-1-22 Monday.md
// // obsidian://open?vault=Personal&file=2024 01 22 Monday.md
//
// async function main() {
//     // 0. Get env vars:
//     const OBSIDIAN_VAULT_NAME: EnvironmentVariable = process.env.OBSIDIAN_VAULT_NAME
//     validateExistingEnvVar(OBSIDIAN_VAULT_NAME, 'Obsidian Vault Name EnvVar')
//
//     console.log("entrypoint execution flow")
//
//     const args = process.argv[2]
//
//     console.log(args)
//
//     // const noteTemplateInput = parseNoteTemplateInput(args)
//
//     // const intervalVars = fetchIntervalEnvVars(noteTemplateInput?.interval)
//
//     // const date = getOrdinalDate(noteTemplateInput)
//
//     // const fullPath = resolveNoteFullPath(
//     //     noteTemplateInput,
//     //     date,
//     //     intervalVars.PATH,
//     //     intervalVars.PATH_FORMAT
//     // )
//
//     const DAILY_PATH: EnvironmentVariable = process.env.DAILY_PATH
//     validateExistingEnvVar(DAILY_PATH, 'Daily Note Folder')
//
//     const DAILY_PATH_FORMAT: EnvironmentVariable = process.env.DAILY_PATH_FORMAT
//     validateExistingEnvVar(DAILY_PATH_FORMAT, 'Daily Note Folder')
//
//     const DAILY_TEMPLATE_PATH: EnvironmentVariable = process.env.DAILY_TEMPLATE_PATH
//     validateExistingEnvVar(DAILY_TEMPLATE_PATH, 'Daily Note Template Folder')
//
//     const day = DateTime.now()
//
//     // 2. Resolve full path
//     const fullPath = resolveFileDateFormatPath(DAILY_PATH!, day, DateUnit.DAY, DAILY_PATH_FORMAT!)
//
//     if (!doesFileExist(fullPath)){
//
//         // 3.a Create Templated file
//         createTemplatedFile(
//             fullPath,
//             DAILY_TEMPLATE_PATH!
//         )
//     }
//
//     const WEEKLY_PATH: EnvironmentVariable = process.env.WEEKLY_PATH
//     validateExistingEnvVar(WEEKLY_PATH, 'Weekly Note Folder')
//
//     const WEEKLY_PATH_FORMAT: EnvironmentVariable = process.env.WEEKLY_PATH_FORMAT
//     validateExistingEnvVar(WEEKLY_PATH_FORMAT, 'Weekly Note Folder')
//
//     const WEEKLY_TEMPLATE_PATH: EnvironmentVariable = process.env.WEEKLY_TEMPLATE_PATH
//     validateExistingEnvVar(WEEKLY_TEMPLATE_PATH, 'WEEKLY Note Template Folder')
//
//     // 1. Get current day
//     // const day = DateTime.now()
//
//     // 2. Resolve full path
//     // const full_path = resolveFileDateFormatPath(DAILY_PATH!, day, DateUnit.DAY, DAILY_PATH_FORMAT!)
//
//     console.log(`Full Path: ${fullPath}`)
//
//     // 3. Check if file exists
//     if (!doesFileExist(fullPath)){
//
//         // 3.a Create Templated file
//         createTemplatedFile(fullPath, DAILY_TEMPLATE_PATH!)
//     }
//
//     // 4. Open file
//     const OBSIDIAN_NOTE_URI = `obsidian://open?vault=Personal&file=${formatDayDate(day)}.md`
//
//     try {
//         await new Promise(() => {
//             void open(OBSIDIAN_NOTE_URI)
//         });
//
//         // open(OBSIDIAN_NOTE_URI, {wait: true});
//
//     } catch (e: unknown) {
//         console.error(`${e as string}`);
//     }
// }
//
// void main()
//
// // try {
// //     open(OBSIDIAN_NOTE_URI);
// // } catch (e: any) {
// //     console.log(`${e}`);
// // }