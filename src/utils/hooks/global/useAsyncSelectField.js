import { useMemo } from 'react';
import { 
    shouldUseAsyncSelect, 
    createLoadOptionsForField, 
    getDefaultOptionsForField 
} from '@/utils/helpers/asyncSelectFieldMapper';
import i18next from 'i18next';

/**
 * Hook to automatically configure async select for a field
 * @param {string} fieldName - The field name
 * @param {Object} oldData - Old data object (for edit/view mode)
 * @param {Object} additionalParams - Additional params to pass to API
 * @returns {Object} Async select configuration { isAsync, loadOptions, defaultOptions }
 */
export function useAsyncSelectField(fieldName, oldData = null, additionalParams = {}) {
    return useMemo(() => {
        // Check if field should use async select
        if (!shouldUseAsyncSelect(fieldName)) {
            return {
                isAsync: false,
                loadOptions: null,
                defaultOptions: false
            };
        }

        // Get the option object from oldData (for selected value)
        const fieldValue = oldData?.[fieldName];
        let includeOption = null;

        // Try to get the full object (some fields store the full object)
        const fieldObjectName = fieldName.replace('_id', '');
        const fieldObject = oldData?.[fieldObjectName] || null;

        if (fieldObject && typeof fieldObject === 'object' && fieldObject.id) {
            includeOption = fieldObject;
        } else if (fieldValue && typeof fieldValue === 'object' && fieldValue.id) {
            includeOption = fieldValue;
        }

        // Create loadOptions
        const loadOptions = createLoadOptionsForField(
            fieldName,
            additionalParams,
            includeOption
        );

        // Get defaultOptions
        const defaultOptions = getDefaultOptionsForField(
            fieldName,
            oldData,
            i18next.language
        );

        return {
            isAsync: true,
            loadOptions,
            defaultOptions
        };
    }, [fieldName, oldData, additionalParams]);
}

/**
 * Hook to get async select config for multiple fields at once
 * @param {Array<string>} fieldNames - Array of field names
 * @param {Object} oldData - Old data object
 * @param {Object} fieldParams - Object mapping field names to their additional params
 * @returns {Object} Object mapping field names to their async config
 */
export function useAsyncSelectFields(fieldNames = [], oldData = null, fieldParams = {}) {
    return useMemo(() => {
        const configs = {};
        
        fieldNames.forEach(fieldName => {
            configs[fieldName] = useAsyncSelectField(
                fieldName,
                oldData,
                fieldParams[fieldName] || {}
            );
        });
        
        return configs;
    }, [fieldNames, oldData, fieldParams]);
}


