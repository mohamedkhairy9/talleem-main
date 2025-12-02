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

        // Check if field has required test (works for all schema types including mixed)
        if (currentSchema.tests && Array.isArray(currentSchema.tests)) {
            const hasRequired = currentSchema.tests.some(test => 
                test.OPTIONS?.name === 'required' || 
                test.name === 'required' ||
                (test.OPTIONS && test.OPTIONS.params && test.OPTIONS.params.name === 'required')
            );
            if (hasRequired) return true;
        }

        // Check exclusiveTests for required
        if (currentSchema.exclusiveTests) {
            if (Object.keys(currentSchema.exclusiveTests).includes('required')) {
                return true;
            }
        }

        // Check spec for required (another way Yup marks required fields)
        if (currentSchema.spec) {
            if (currentSchema.spec.presence === 'required') {
                return true;
            }
            // For optional fields marked as required via .required()
            if (currentSchema.spec.optional === false) {
                return true;
            }
        }

        // Check _whitelist for required (some Yup versions use this)
        if (currentSchema._whitelist && currentSchema._whitelist.size > 0) {
            // Check if this is from a required() call by checking tests again
            if (currentSchema.describe && typeof currentSchema.describe === 'function') {
                const description = currentSchema.describe();
                if (description.tests?.some(t => t.name === 'required')) {
                    return true;
                }
            }
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

