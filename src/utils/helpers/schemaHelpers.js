/**
 * Check if a field is required in a yup schema
 * @param {Object} schema - Yup schema object
 * @param {string} fieldPath - Field path (e.g., 'name.en', 'email')
 * @returns {boolean} - Whether the field is required
 */
export const isFieldRequired = (schema, fieldPath) => {
    if (!schema || !fieldPath) return false;

    try {
        const pathParts = fieldPath.split('.');
        let currentSchema = schema;

        // Navigate through nested schemas
        for (const part of pathParts) {
            if (!currentSchema || !currentSchema.fields) {
                return false;
            }
            currentSchema = currentSchema.fields[part];
        }

        if (!currentSchema) return false;

        // Check if field has required test
        if (currentSchema.tests) {
            return currentSchema.tests.some(test => test.OPTIONS?.name === 'required');
        }

        // Check exclusiveTests for required
        if (currentSchema.exclusiveTests) {
            return Object.keys(currentSchema.exclusiveTests).includes('required');
        }

        // Check spec for required
        if (currentSchema.spec && currentSchema.spec.presence === 'required') {
            return true;
        }

        return false;
    } catch (error) {
        console.error('Error checking if field is required:', error);
        return false;
    }
};

/**
 * Get all required fields from a schema
 * @param {Object} schema - Yup schema object
 * @param {string} prefix - Prefix for nested fields
 * @returns {Array} - Array of required field paths
 */
export const getRequiredFields = (schema, prefix = '') => {
    if (!schema || !schema.fields) return [];

    const requiredFields = [];

    Object.keys(schema.fields).forEach(key => {
        const fieldPath = prefix ? `${prefix}.${key}` : key;
        const field = schema.fields[key];

        if (field.type === 'object' && field.fields) {
            // Recursively check nested objects
            requiredFields.push(...getRequiredFields(field, fieldPath));
        } else if (isFieldRequired(schema, key)) {
            requiredFields.push(fieldPath);
        }
    });

    return requiredFields;
};

