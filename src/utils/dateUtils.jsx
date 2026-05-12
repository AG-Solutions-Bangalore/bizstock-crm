import moment from "moment";

/**
 * A highly flexible and reusable date utility.
 * It provides various ways to format and manipulate the "latest" (current) date or any given date.
 */

/**
 * Formats a date with a customizable format string.
 * @param {Date|string|number} date - The date to format. Defaults to now.
 * @param {string} format - Moment.js format string. Defaults to "DD/MM/YYYY".
 * @returns {string}
 */
export const formatLatestDate = (date = new Date(), format = "DD/MM/YYYY") => {
  return moment(date || new Date()).format(format);
};

/**
 * Returns a relative time string (e.g., "2 hours ago").
 * @param {Date|string|number} date 
 * @returns {string}
 */
export const getRelativeDate = (date) => {
  return moment(date).fromNow();
};

/**
 * Preset date formats for consistent usage across the app.
 */
export const DATE_PRESETS = {
  DISPLAY: "DD/MM/YYYY",
  DB_DATE: "YYYY-MM-DD",
  FULL_DATE: "MMMM Do YYYY",
  DATE_TIME: "DD/MM/YYYY, h:mm:ss a",
  MONTH_YEAR: "MMMM YYYY",
  SHORT_MONTH: "DD MMM, YYYY",
};

/**
 * Useful for filtering reports starting from the current month.
 */
export const getCurrentMonthStart = (format = "YYYY-MM-DD") => {
  return moment().startOf("month").format(format);
};

/**
 * Useful for filtering reports ending at today.
 */
export const getCurrentDateForDB = () => {
  return moment().format("YYYY-MM-DD");
};
