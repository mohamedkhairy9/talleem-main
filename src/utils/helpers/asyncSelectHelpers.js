import i18next from 'i18next';

/**
 * Creates a loadOptions function for react-select AsyncSelect with pagination support
 * @param {Function} apiService - The API service function that accepts params and returns Promise
 * @param {Object} additionalParams - Additional params to pass to the API (e.g., filters)
 * @param {Function} transformOption - Optional function to transform API response items to select options
 * @returns {Function} loadOptions function compatible with react-select AsyncSelect
 */
/**
 * Creates a loadOptions function for react-select-async-paginate with proper pagination support
 * @param {Function} apiService - The API service function that accepts params and returns Promise
 * @param {Object} additionalParams - Additional params to pass to the API (e.g., filters)
 * @param {Function} transformOption - Optional function to transform API response items to select options
 * @returns {Function} loadOptions function compatible with react-select-async-paginate
 */
export function createAsyncLoadOptions(apiService, additionalParams = {}, transformOption = null) {
    return async (searchQuery, loadedOptions, { page } = {}) => {
        const lang = i18next.language;
        const perPage = 10; // Items per page
        const currentPage = page || 1;
        
        try {
            // Build search params
            // Note: per_page must be set AFTER spreading additionalParams to avoid being overridden
            const params = {
                ...additionalParams,
                page: currentPage,
                per_page: perPage
            };

            // Add search query if provided
            if (searchQuery && searchQuery.trim()) {
                params.search = searchQuery.trim();
            }

            // Call API
            const response = await apiService(params);
            
            // Handle different response structures
            let items = [];
            let hasMore = false;
            let totalPages = 1;

            if (response?.data && Array.isArray(response.data)) {
                items = response.data;
                if (response.meta) {
                    hasMore = response.meta.current_page < response.meta.last_page;
                    totalPages = response.meta.last_page || 1;
                } else {
                    hasMore = items.length >= perPage;
                }
            } else if (Array.isArray(response)) {
                items = response;
                hasMore = items.length >= perPage;
            }

            // Transform items to select options
            const options = items.map(item => {
                if (transformOption) {
                    return transformOption(item);
                }
                
                // Default transformation
                const name = item.name?.[lang] || item.name?.en || item.name?.ar || item.name || item.label || '';
                return {
                    label: name,
                    value: item.id !== undefined ? item.id : item.value,
                    id: item.id,
                    name: item.name
                };
            });

            return {
                options,
                hasMore,
                additional: {
                    page: currentPage + 1
                }
            };
        } catch (error) {
            console.error('Error loading options:', error);
            return {
                options: [],
                hasMore: false
            };
        }
    };
}

/**
 * Creates a loadOptions function that also includes a specific option (e.g., selected value from oldData)
 * @param {Function} apiService - The API service function
 * @param {Object} additionalParams - Additional params
 * @param {Object} includeOption - Option object to always include (e.g., {id: 1, name: {en: 'Test', ar: 'اختبار'}})
 * @param {Function} transformOption - Optional transform function
 * @returns {Function} loadOptions function compatible with react-select-async-paginate
 */
export function createAsyncLoadOptionsWithIncluded(apiService, additionalParams = {}, includeOption = null, transformOption = null) {
    const baseLoadOptions = createAsyncLoadOptions(apiService, additionalParams, transformOption);
    
    return async (searchQuery, loadedOptions, additional) => {
        const result = await baseLoadOptions(searchQuery, loadedOptions, additional);
        
        // If we have an option to include and it's not already in the results
        // Only include on first page load (when searchQuery is empty or page is 1)
        if (includeOption && result.options && (!searchQuery || (additional?.page === 1 || !additional?.page))) {
            const lang = i18next.language;
            const includeId = includeOption.id || includeOption.value;
            const alreadyIncluded = result.options.some(opt => 
                opt.value === includeId || opt.id === includeId
            );
            
            if (!alreadyIncluded) {
                const includeName = includeOption.name?.[lang] || 
                    includeOption.name?.en || 
                    includeOption.name?.ar || 
                    includeOption.name || 
                    includeOption.label || '';
                
                const includeOptionFormatted = {
                    label: includeName,
                    value: includeId,
                    id: includeId,
                    name: includeOption.name
                };
                
                // Add at the beginning
                result.options = [includeOptionFormatted, ...result.options];
            }
        }
        
        return result;
    };
}

