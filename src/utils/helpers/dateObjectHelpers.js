/**
 * Global helpers for API date values that can be either:
 * - Legacy: a string (e.g. "2025-11-04 20:13:45" or ISO with T)
 * - New format: { gregorian, hijri, hijri_indic }
 *
 * Use these helpers everywhere dates are read (created_at, updated_at, date_of_birth, etc.)
 * When format is omitted, formatDateForDisplay uses the global date format from dateFormat store.
 */

import useDateFormatStore from '@/utils/stores/dateFormat.store';

const DATE_OBJECT_KEYS = ['gregorian', 'hijri', 'hijri_indic'];

/**
 * Check if value is the new date object format from the API
 * @param {*} value
 * @returns {boolean}
 */
export function isDateObject(value) {
    if (value == null || typeof value !== 'object' || Array.isArray(value)) {
        return false;
    }
    return (
        typeof value.gregorian === 'string' &&
        DATE_OBJECT_KEYS.some(k => k in value)
    );
}

/**
 * Get a single date string from a date value (string or object).
 * Use for parsing (new Date), form inputs, or display.
 * @param {string|{gregorian?: string, hijri?: string, hijri_indic?: string}|null|undefined} value - API date value
 * @param {'gregorian'|'hijri'|'hijri_indic'} [format='gregorian']
 * @returns {string|null} - The date string or null
 */
export function getDateString(value, format = 'gregorian') {
    if (value == null) return null;
    if (typeof value === 'string') return value;
    if (isDateObject(value)) {
        const str = value[format] ?? value.gregorian;
        return str ?? null;
    }
    return null;
}

/** Extract time part (HH:MM:SS or HH:MM) from a gregorian date string */
function extractGregorianTime(gregorianStr) {
    if (!gregorianStr || typeof gregorianStr !== 'string') return null;
    const match = gregorianStr.match(/\d{2}:\d{2}(?::\d{2})?$/);
    return match ? match[0] : null;
}

/**
 * Strip any time (Western or Arabic-Indic HH:MM:SS) from a date string, from any position.
 * @param {string} str
 * @returns {string} - Date string with time removed, trimmed
 */
function stripTimeFromString(str) {
    if (!str || typeof str !== 'string') return str || '';
    return str
        .replace(/\s*\d{2}:\d{2}(?::\d{2})?\s*/g, ' ')
        .replace(/\s*[٠-٩]{2}:[٠-٩]{2}(?::[٠-٩]{2})?\s*/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * Get hijri/hijri_indic date string but with time shown as in Gregorian (Western numerals) at the end.
 * Handles API returning time in the middle (e.g. "9 06:30:05 1447 رمضان") by stripping time and appending at end.
 * @param {string|{gregorian?: string, hijri?: string, hijri_indic?: string}|null|undefined} value - API date value
 * @param {'hijri'|'hijri_indic'} format
 * @returns {string|null}
 */
export function getDateStringWithGregorianTime(value, format) {
    if (value == null || !isDateObject(value)) return getDateString(value, format);
    const gregorian = value.gregorian;
    const hijriStr = value[format] ?? value.hijri ?? value.gregorian;
    if (!hijriStr) return null;
    const time = extractGregorianTime(gregorian);
    const datePart = stripTimeFromString(hijriStr);
    if (!time) return datePart || hijriStr;
    return datePart ? `${datePart} ${time}` : time;
}

/**
 * Get date-only string (YYYY-MM-DD) for date inputs.
 * Handles both legacy strings and new date objects.
 * @param {string|object|null|undefined} value - API date value
 * @returns {string|null} - "YYYY-MM-DD" or null
 */
export function onlyDate(value) {
    const str = getDateString(value, 'gregorian');
    if (!str) return null;
    // "2025-11-04 20:13:45" -> "2025-11-04"  or  "2025-11-04T20:13:45" -> "2025-11-04"
    const datePart = str.split('T')[0].split(' ')[0];
    return datePart || null;
}

/**
 * Get a date string suitable for display (e.g. in views/modals).
 * When format is omitted, uses the global date format from the date format store (navbar switcher).
 * For hijri/hijri_indic, the time is shown in Gregorian (Western) numerals.
 * @param {string|object|null|undefined} value - API date value
 * @param {'gregorian'|'hijri'|'hijri_indic'} [format] - If omitted, uses global preference
 * @returns {string} - Display string or '-'
 */
export function formatDateForDisplay(value, format) {
    const resolvedFormat = format ?? useDateFormatStore.getState()?.dateFormat ?? 'gregorian';
    if (resolvedFormat === 'hijri' || resolvedFormat === 'hijri_indic') {
        const str = getDateStringWithGregorianTime(value, resolvedFormat);
        if (str) return str;
    } else {
        const str = getDateString(value, resolvedFormat);
        if (str) return str;
    }
    const gregorian = getDateString(value, 'gregorian');
    return gregorian ?? '-';
}

/**
 * Get a Date instance from API date value (for formatting with toLocaleString, etc.)
 * @param {string|object|null|undefined} value - API date value
 * @returns {Date|null} - Date or null if invalid
 */
export function toDate(value) {
    const str = getDateString(value, 'gregorian');
    if (!str) return null;
    const d = new Date(str);
    return Number.isNaN(d.getTime()) ? null : d;
}
