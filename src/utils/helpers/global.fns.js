import i18next from 'i18next';

export const prepareFormData = data => {
    const formData = new FormData();

    const appendToFormData = (key, value) => {
        console.log('key', key);
        if (value === null || value === undefined) return;

        // Handle File instances (including from file inputs)
        if (value instanceof File) {
            formData.append(key, value);
        }
        // Handle FileList (from file inputs)
        else if (value instanceof FileList) {
            // Append first file if exists (for single file upload)
            if (value.length > 0) {
                formData.append(key, value[0]);
            }
        }
        // Handle Arrays
        else if (Array.isArray(value)) {
            // Check if it's an array of Files
            const isFileArray = value.length > 0 && value[0] instanceof File;

            if (isFileArray) {
                // For file arrays, append each file with files[] notation
                value.forEach(file => {
                    if (file instanceof File) {
                        formData.append(`${key}[]`, file);
                    }
                });
            } else {
                // For other arrays, use indexed notation
                value.forEach((item, idx) => {
                    appendToFormData(`${key}[${idx}]`, item);
                });
            }
        }
        // Handle nested objects (but not File or FileList)
        else if (typeof value === 'object') {
            // Special handling for multilingual fields (name, description, etc.)
            // Check if it's a multilingual object with 'en' and/or 'ar' keys
            const isMultilingual =
                Object.prototype.hasOwnProperty.call(value, 'en') ||
                Object.prototype.hasOwnProperty.call(value, 'ar');

            if (isMultilingual) {
                // Use bracket notation: name[en], name[ar]
                Object.entries(value).forEach(([subKey, subValue]) => {
                    if (subValue !== null && subValue !== undefined) {
                        formData.append(`${key}[${subKey}]`, subValue);
                    }
                });
            } else {
                // Use dot notation for other nested objects
                Object.entries(value).forEach(([subKey, subValue]) => {
                    appendToFormData(`${key}[${subKey}]`, subValue);
                });
            }
        }
        // Handle primitives (string, number, boolean)
        else {
            formData.append(key, value);
        }
    };

    Object.entries(data).forEach(([key, value]) => {
        appendToFormData(key, value);
    });

    return formData;
};

export function generateOptions(arr = [], valueKey, labelKey) {
    if (arr?.length > 0) {
        return arr.map(opt => ({
            label:
                opt.name?.[i18next.language] ||
                opt.label?.[i18next.language] ||
                opt.name ||
                opt.label ||
                opt[labelKey],
            value:
                opt.id !== undefined
                    ? opt.id
                    : opt.value !== undefined
                    ? opt.value
                    : opt[valueKey] !== undefined
                    ? opt[valueKey]
                    : false
        }));
    }
    return [];
}

export function generateBilingualOptions(
    arr = [],
    valueKey = 'id',
    nameKey = 'name',
    language = 'en'
) {
    if (arr?.length > 0) {
        return arr
            .map(opt => ({
                id: opt[valueKey],
                name:
                    opt[nameKey]?.[language] ||
                    opt[nameKey]?.en ||
                    opt[nameKey]?.ar ||
                    `Item ${opt[valueKey]}`,
                value: opt[valueKey],
                label:
                    opt[nameKey]?.[language] ||
                    opt[nameKey]?.en ||
                    opt[nameKey]?.ar ||
                    `Item ${opt[valueKey]}`
            }))
            .reverse();
    }
    return [];
}

export function generateTableData(data = []) {
    const lang = i18next.language;

    function check(field) {
        if (field && typeof field === 'object' && field[lang]) {
            return field[lang];
        }
        return field;
    }

    return data.map(el => {
        const obj = {};
        for (const [key, value] of Object.entries(el)) {
            obj[key] = check(value);
        }
        return obj;
    });
}

export const getOriginalObject = (identfier, arr = []) => {
    let id = identfier;
    if (typeof identfier === 'object') {
        id = identfier.id;
    }
    return arr.find(el => el.id == id);
};

export function onlyDate(date) {
    return date ? date.split('T')[0] : null;
}
