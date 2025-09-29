/**
 * Safely get nested error message from React Hook Form errors object
 * @param {Object} errors - The errors object from React Hook Form
 * @param {string} path - The dot-notation path to the error (e.g., 'display_name.en')
 * @returns {string|undefined} - The error message or undefined if not found
 */
export function getNestedError(errors, path) {
    if (!errors || !path) return undefined;

    const keys = path.split('.');
    let current = errors;

    for (const key of keys) {
        if (current && typeof current === 'object' && key in current) {
            current = current[key];
        } else {
            return undefined;
        }
    }

    return current?.message;
}

/**
 * Alternative approach using bracket notation for React Hook Form
 * This works directly with the field name as React Hook Form stores it
 * @param {Object} errors - The errors object from React Hook Form
 * @param {string} fieldName - The field name (e.g., 'display_name.en')
 * @returns {string|undefined} - The error message or undefined if not found
 */
export function getFieldError(errors, fieldName) {
    return errors?.[fieldName]?.message;
}
