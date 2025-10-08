import i18next from 'i18next';

export const prepareFormData = data => {
    const formData = new FormData();

    const appendToFormData = (key, value) => {
        if (value === null || value === undefined) return;

        if (Array.isArray(value)) {
            value.forEach((item, idx) => {
                appendToFormData(`${key}[${idx}]`, item);
            });
        } else if (typeof value === 'object' && !(value instanceof File)) {
            Object.entries(value).forEach(([subKey, subValue]) => {
                appendToFormData(`${key}.${subKey}`, subValue);
            });
        } else {
            formData.append(key, value);
        }
    };

    Object.entries(data).forEach(([key, value]) => {
        appendToFormData(key, value);
    });

    return formData;
};

export function generateOptions(arr = [], valueKey, labelKey) {
    console.log('arr', arr);

    console.log(arr.map(opt => opt.id ?? opt.value ?? opt[valueKey] ?? 222));

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
