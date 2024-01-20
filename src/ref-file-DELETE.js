/* cSpell:disable */

ObjC.import('stdlib');

console.log('Running workflow action script - ' + getActionName())

// get the current app to access the standard additions
app = Application.currentApplication();
app.includeStandardAdditions = true;

/**
 * Constants
 */
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const months_short = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// https://momentjscom.readthedocs.io/en/latest/moment/07-customization/04-weekday-abbreviations/
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const days_short = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const days_e = [0, 1, 2, 3, 4, 5, 6];
const days_E = [7, 1, 2, 3, 4, 5, 6];

const inputDates = {
    TODAY: Symbol("today"),
    TOMORROW: Symbol("tomorrow")
}

/**
 * Helper Functions
 */

/**
 * Define the workflow action name and return friendly string
 */
function getActionName() {
    return "Open Obsidian Daily Note"
}

/**
 * Validates if the environment variable was set.  Additionally, console logs the set env var
 *
 * @param {string} environmentVariable
 * @param {string} friendlyName
 * @throws {WorkflowException} if environment variable wasn't set
 */
function validateExistingEnvVar(environmentVariable, friendlyName = 'Environment variable') {
    if (!isEnvVarSet(environmentVariable)) {
        throw new WorkflowException('Missing environment variable: ' + environmentVariable)
    }
    console.log(friendlyName + ": " + environmentVariable)
}

/**
 * Validates if the provided vault actually exists in the user's obsidian configuration.
 *
 * @param {string} vaultName
 * @throws {WorkflowException} if vault does not exist
 */
function validateVaultExists(vaultName) {
    // const vaults = app.vault.getVaults()

    // TODO:  Find Obsidian API to retrieve all vaults
    // if (!app.vault.getAbstractFileByPath(vaultName)) {
    //     throw new WorkflowException('Vault name does not exist: ' + vaultName)
    // }
}

/**
 * Returns a boolean if the environment variable exists or not.
 *
 * @param environmentVariable
 * @returns {boolean}
 */
function isEnvVarSet(environmentVariable) {
    const isEnvVarSet = environmentVariable !== undefined && environmentVariable !== null && environmentVariable !== '';
    if (isEnvVarSet) {
        console.log('Environment variable ' + environmentVariable + ' is set.')
    } else {
        console.log('Environment variable ' + environmentVariable + ' is not set.')
    }

    return isEnvVarSet
}

/**
 * Custom exception that sends an error to the console and brings up an error window.
 *
 * @param {string} message
 * @returns {Error}
 * @constructor
 */
function WorkflowException(message) {
    const error = new Error(message);
    console.log(error);
    app.displayDialog("Workflow error: " + message)
    return error;
}

WorkflowException.prototype = Object.create(Error.prototype);

/**
 * Replaces the home directory tilde with the full path if provided.
 * @param {string} path - The path that may start with tilde
 * @returns {string} The path with tilde replaced by home directory
 *
 * This function takes a path as a parameter and replaces any leading
 * tilde character (~), which represents the home directory, with the
 * full path to the home folder.
 *
 * It first gets the home directory path by calling app.pathTo('home folder').
 * Then it uses a regular expression /^~/ to search for the tilde at the
 * start of the path string. The tilde is replaced with the homepath using
 * String.replace().
 *
 * This allows a path starting with ~ to be converted to the full path
 * for use within the application.
 */
function interpolateHomepath(path) {
    homepath = app.pathTo('home folder')
    return path.replace(/^~/, homepath)
}

/**
 *  Gets the ISO 8601 week number for a given date
 *  @param {Date} dt - The date to get the week number for
 *  @returns {number} The ISO 8601 week number
 *   This function calculates the ISO 8601 week number for the given date.
 *   It first makes a copy of the date so as not to modify the original.
 *   It then calculates the number of days between the input date and the
 *   following Thursday. This gives us the date of the first Thursday in
 *   the week.
 *
 *   Next, it sets the copy to January 1st of the same year. If the day
 *   of the week is not Thursday, it calculates how many days to add/subtract
 *   to roll the date to the preceding Thursday.
 *   Finally, it returns the week number by comparing the milliseconds
 *   between the first Thursday and January 1st, divided by the milliseconds
 *   in a week (to get the week decimal). This value is rounded up.
 */
function getWeekNumber(dt) {
    // TODO: Refactor implementation
    var tdt = new Date(dt.valueOf());
    var dayn = (dt.getDay() + 6) % 7;
    tdt.setDate(tdt.getDate() - dayn + 3);
    var firstThursday = tdt.valueOf();
    tdt.setMonth(0, 1);
    if (tdt.getDay() !== 4) {
        tdt.setMonth(0, 1 + ((4 - tdt.getDay()) + 7) % 7);
    }
    return 1 + Math.ceil((firstThursday - tdt) / 604800000);
}

/**
 * Finds the maximum length of repeating sequences in an array.
 * @param {array} arr - The input array
 * @returns {object} An object with keys representing unique repeating
 * values in the array, and values being the maximum length seen for
 * that value
 *
 * This function analyzes an array to find any repeating sequences
 * within it. It first calls another function `repeatingSeqs()` which
 * would return all repeating sequences as nested arrays.
 *
 * It then uses Array.reduce to iterate through these sequences. The
 * reducer keeps track of counts in an object, with keys for each unique
 * repeating value. On each iteration it checks if the current sequence
 * length is greater than the stored count, and updates if so.
 *
 * After reducing, the returned object will contain the maximum seen
 * length for each distinct repeating value in the original array.
 */
function maxRepeatingSeqLens(arr) {
    return repeatingSeqs(arr).reduce(
        (counts, chain) => ({
            ...counts,
            [chain[0]]:
                counts[chain[0]] > chain.length
                    ? counts[chain[0]]
                    : chain.length,
        }),
        {}
    );
}

// determine no. of y, m, d needed
function repeatingSeqs(arr) {
    // 	repeatingSeqs('day-yyyy-mm-dd'.split("")) == [
    //   [ 'd' ],
    //   [ 'a' ],
    //   [ 'y' ],
    //   [ '-' ],
    //   [ 'y', 'y', 'y', 'y' ],
    //   [ '-' ],
    //   [ 'm', 'm' ],
    //   [ '-' ],
    //   [ 'd', 'd' ]
    // ]
    return arr.reduce((agg, x) => {
        const phrase = agg[agg.length - 1];
        if (phrase && phrase.length && phrase[0] === x) {
            return [...agg.slice(0, -1), phrase.concat(phrase[0])];
        } else {
            return [...agg, [x]];
        }
    }, []);
}

/**
 * Transforms a date format string into a formatted date string based on today's date.
 * This function supports formatting year, month, day, and week numbers, as well as
 * full and short names of days and months. It also handles standalone 'e' and 'E' characters
 * to represent the day of the week as a number. Placeholders are used to avoid accidental
 * replacements in the format string.
 *
 * @param {string} dateFormat - A format string specifying the desired date format.
 *                               Format specifiers include:
 *                               - 'yyyy', 'yy' for year
 *                               - 'mmmm', 'mmm', 'mm', 'm' for month
 *                               - 'dddd', 'ddd', 'dd', 'd' for day
 *                               - 'ww', 'w' for week number
 *                               - 'e', 'E' for numeric day of the week (0-6)
 *                               Example format: "yyyy-mm-dd dddd"
 *
 * @param {symbol} inputDate - The date to transform. If not provided, the current date is used.
 * @returns {string} A string representing today's date formatted according to the provided format.
 *                   If the format is not recognized or if any necessary data (like months array)
 *                   is missing, the function may not return the expected result.
 *
 * @example
 * // returns a formatted string representing today's date, e.g., "2023-04-01 Saturday"
 * transformDailyDateFormat("yyyy-mm-dd dddd");
 *
 * @example
 * // returns a short format of today's date, e.g., "23-Apr-01 Sat"
 * transformDailyDateFormat("yy-mmm-dd ddd");
 */
function transformDailyDateFormat(dateFormat, inputDate = inputDates.TODAY) {
    // Define unique placeholders
    const placeholderDayFull = '{{day_full}}';
    const placeholderDayShort = '{{day_short}}';
    const placeholderE = '{{e}}';
    const placeholderEUpper = '{{E}}';

    let date = new Date();

    if (inputDate === inputDates.TOMORROW) {
        date.setDate(date.getDate() + 1)
    }

    let yyyy = date.getFullYear().toString();
    let mm = (date.getMonth() + 1).toString();
    let dd = date.getDate().toString();
    let ww = getWeekNumber(date).toString();
    let day = date.getDay()

    // Replace day names if present
    if (dateFormat.includes('dddd')) {
        dateFormat = dateFormat.replace('dddd', placeholderDayFull);
    }
    if (dateFormat.includes('ddd')) {
        dateFormat = dateFormat.replace('ddd', placeholderDayShort);
    }

    /**
     * Replaces a standalone character in a string with a specified placeholder.
     * A standalone character is defined as a character that is not immediately preceded or followed
     * by any word character (letter, digit, or underscore). This function uses a regular expression
     * to identify such standalone instances.
     *
     * Regular Expression Explanation:
     * - `(?<!\\w)`: Negative lookbehind assertion ensuring the character is not preceded by a word character.
     * - `${char}`: The target character to be replaced, inserted into the regular expression.
     * - `(?!\\w)`: Negative lookahead assertion ensuring the character is not followed by a word character.
     *
     * @param {string} provided_date_format - The date format to be modified
     * @param {string} char - The character to be replaced if it appears standalone in the string.
     * @param {string} placeholder - The placeholder string to replace the standalone character with.
     * @returns {string} The modified string with all standalone instances of the specified character
     *                   replaced by the placeholder.
     *
     * @example
     * // Example usage:
     * let formattedString = replaceStandaloneCharacter('e', '!!!');
     * // If 'e' appears standalone in formattedString, it will be replaced with '!!!'.
     *
     * @note
     * - Special characters (like '.', '*', etc.) must be properly escaped if used as `char`.
     * - The function may not recognize Unicode word characters correctly, depending on the environment.
     * - Ensure this function is tested in the intended environment, especially for edge cases.
     */
    function replaceStandaloneCharacter(provided_date_format, char, placeholder) {
        const regex = new RegExp(`(?<!\\w)${char}(?!\\w)`, 'g');
        return dateFormat.replace(regex, placeholder);
    }

    dateFormat = replaceStandaloneCharacter(dateFormat, 'e', placeholderE);
    dateFormat = replaceStandaloneCharacter(dateFormat, 'E', placeholderEUpper);


    dateFormat = dateFormat.toLowerCase();

    // Get max repeating sequence lengths for year, month, day, and week
    const n_char = maxRepeatingSeqLens(dateFormat.split(""));
    const formatSpecifiers = {
        y: 'y'.repeat(n_char['y'] || 1),
        m: 'm'.repeat(n_char['m'] || 1),
        d: 'd'.repeat(n_char['d'] || 1),
        w: 'w'.repeat(n_char['w'] || 1)
    };

    // Slice date components based on format
    yyyy = yyyy.slice(-formatSpecifiers.y.length);
    mm = mm.slice(-formatSpecifiers.m.length);
    dd = dd.slice(-formatSpecifiers.d.length);
    ww = ww.slice(-formatSpecifiers.w.length);

    // Replace format specifiers in the date format
    dateFormat = dateFormat
        .replace(formatSpecifiers.y, yyyy)
        .replace(formatSpecifiers.m, mm)
        .replace(formatSpecifiers.d, dd)
        .replace(formatSpecifiers.w, ww);

    // Convert to month names if requested
    if (formatSpecifiers.m === 'mmmm') {
        dateFormat = dateFormat.replace(mm, months[parseInt(mm, 10) - 1]);
    } else if (formatSpecifiers.m === 'mmm') {
        dateFormat = dateFormat.replace(mm, months_short[parseInt(mm, 10) - 1]);
    }

    // Replace day of week and 'e'/'E' placeholders
    dateFormat = dateFormat.replace(placeholderDayFull, days[day])
        .replace(placeholderDayShort, days_short[day])
        .replace(placeholderE, days_e[day].toString())
        .replace(placeholderEUpper, days_E[day].toString());


    console.log('Modified Date Format: ' + dateFormat);

    return dateFormat;
}

/**
 * Constructs the Obsidian URI for the daily note based on vault and date format.
 *
 * @param {string} vaultName
 * @param {string} dateFormat
 * @returns {string}
 */
function constructObsidianUri(vaultName, dateFormat) {
    let fileUri = "obsidian://open?vault=" + encodeURIComponent(vaultName) + "&file=" + dateFormat + ".md";
    console.log('Obsidian File URI: ' + fileUri)
    return fileUri
}

/**
 * Constructs the file path for the daily note based on full path of user's daily notes and date format.
 *
 * @param {string} fullPathDailyEnv
 * @param {string} dateFormat
 * @returns {string}
 */
function constructNoteFilePath(fullPathDailyEnv, dateFormat) {
    let filepath = fullPathDailyEnv + "/" + dateFormat + ".md"
    console.log('Constructed file path: ' + filepath)
    return filepath
}

/**
 * Gets the template content from the provided file path to a template file.
 *
 * @param {string} templateFilePath
 * @returns {string}
 */
function fetchTemplateContent(templateFilePath) {
    const template_path_obj = Path(templateFilePath);
    console.log('template_path_obj', template_path_obj)
    let content = ''

    try {
        content = app.read(template_path_obj)
    } catch (e) {
        throw new WorkflowException("Error reading template file.  Are you sure env var for template path is a file and not directory?" + e)
    }
    return content
}

/**
 * Main Script Execution
 */

// 1. Load all workflow environment variables

// Date Format for Daily Note name
const dateFormatEnv = $.getenv('dailyformat');
validateExistingEnvVar(dateFormatEnv, "Date Format EnvVar");

// Obsidian Vault name
const vaultName = $.getenv('dailyvaultname');
validateExistingEnvVar(vaultName, "Vault Name EnvVar");

// validate Obsidian vault exists
validateVaultExists(vaultName)

// Full path to the directory where you keep your daily notes
// TODO:  Validate or warn when provided env var is actually a valid path (Not deterministic)
const fullPathDailyEnv = interpolateHomepath($.getenv('dailyabspath'));
validateExistingEnvVar(fullPathDailyEnv, "Full Path Daily EnvVar")

// Full path to the template for your daily note (optional)
// TODO:  Validate or warn when provided env var is actually a valid file path and not directory (Not deterministic)
const dailyTemplateFilePath = interpolateHomepath($.getenv('dailytempabspath'));

// 2. Transform provided date format
let modifiedDateFormat = transformDailyDateFormat(dateFormatEnv, inputDates.TODAY)

// Get the Obsidian URI to open
let obsidianFileUri = constructObsidianUri(vaultName, modifiedDateFormat);

// 3. Get template content (if exists)
let templateContent = ''
if (isEnvVarSet(dailyTemplateFilePath)) {
    templateContent = fetchTemplateContent(dailyTemplateFilePath);
}

// TODO:  This can be refactored
let noteFilePath = constructNoteFilePath(fullPathDailyEnv, modifiedDateFormat)
let path = Path(noteFilePath)
let finderApp = Application("Finder")
// Create new daily note if it doesn't exist
if (!finderApp.exists(path)) {
    console.log("Note doesn't exist. Creating note.")
    var openedFile = app.openForAccess(path, {writePermission: true})
    //   If the daily note template is set, retrieve and add to new note
    //   If the template isn't set, then create new blank note
    app.write(templateContent, {to: openedFile, startingAt: app.getEof(openedFile)})
    app.closeAccess(openedFile)
    // wait a bit for note to show up in file system
    delay(1)
}

// TODO:  See why this is needed
if (modifiedDateFormat === "2111") {
    throw new WorkflowException("Set up the workflow first")
}

// Open Obsidian on the newly created note.
try {
    app.openLocation(obsidianFileUri);
} catch (e) {
    throw new WorkflowException("Error opening obsidian file: " + e)
}

// save today note path
Application('com.runningwithcrayons.Alfred').setConfiguration("dailypath", {
    toValue: noteFilePath,
    exportable: false,
    inWorkflow: $.getenv('alfred_workflow_bundleid'),
});