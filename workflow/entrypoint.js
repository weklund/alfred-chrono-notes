import alfy from 'alfy';
import open from "open";
import { formatDayDate } from "./utils/utils";
import { DateTime } from "luxon";
// TODO:  Change this entrypoint file to handle validation of configuration variables, validate installation of Obsidian, and Obsidian Periodic Notes plugin
const now = DateTime.now().setLocale("en-US");
// Write a function that manually reformats a Date object to show this format 'yyyy mm dd dddd'
// If the month is a single digit, make sure to add a 0 before it to make it 2 digits
// const formatDate = (date: Date) => `${date.getFullYear()} ${date.getMonth() + 1} ${date.getDate()} ${DAYS[date.getDay()]}`
// obsidian://advanced-uri?vault=Personal&filepath=999-Planner%252FDailyPlans%252F2024-01-22%2520Monday.md
// obsidian://open?vault=Personal&file=999-Planner%2FDailyPlans%2F2024-01-22%20Monday
// obsidian://open?vault=Personal&file=2024-1-22 Monday.md
// obsidian://open?vault=Personal&file=2024 01 22 Monday.md
const OBSIDIAN_CURRENT_NOTE = `obsidian://open?vault=Personal&file=${formatDayDate(now)}.md`;
try {
    open(OBSIDIAN_CURRENT_NOTE);
}
catch (e) {
    alfy.log(`${e}`);
}
