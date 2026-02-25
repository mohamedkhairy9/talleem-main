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
 * @param {string|object|null|undefined} value - API date value
 * @param {'gregorian'|'hijri'|'hijri_indic'} [format] - If omitted, uses global preference
 * @returns {string} - Display string or '-'
 */
export function formatDateForDisplay(value, format) {
    const resolvedFormat = format ?? useDateFormatStore.getState()?.dateFormat ?? 'gregorian';
    const str = getDateString(value, resolvedFormat);
    if (str) return str;
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
