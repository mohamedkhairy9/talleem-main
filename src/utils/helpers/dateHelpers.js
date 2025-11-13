/**
 * Get the maximum date for a minimum age requirement
 * @param {number} minAge - Minimum age in years
 * @returns {string} - Date string in YYYY-MM-DD format
 */
export const getMaxDateForMinAge = (minAge) => {
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate());
    return maxDate.toISOString().split('T')[0];
};

/**
 * Get the minimum date for a maximum age requirement
 * @param {number} maxAge - Maximum age in years
 * @returns {string} - Date string in YYYY-MM-DD format
 */
export const getMinDateForMaxAge = (maxAge) => {
    const today = new Date();
    const minDate = new Date(today.getFullYear() - maxAge, today.getMonth(), today.getDate());
    return minDate.toISOString().split('T')[0];
};

/**
 * Get date range for age requirements
 * @param {number} minAge - Minimum age in years
 * @param {number} maxAge - Maximum age in years (optional)
 * @returns {Object} - Object with min and max date strings
 */
export const getDateRangeForAge = (minAge, maxAge = 120) => {
    return {
        min: getMinDateForMaxAge(maxAge),
        max: getMaxDateForMinAge(minAge)
    };
};