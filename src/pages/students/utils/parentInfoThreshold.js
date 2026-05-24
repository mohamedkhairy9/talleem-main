export const DEFAULT_PARENT_INFO_AGE_THRESHOLD = 18;

const PARENT_INFO_THRESHOLD_KEY_ALIASES = new Set([
    'parent_info_age_threshold',
    'guardian_info_age_threshold',
    'parent_information_age_threshold',
    'guardian_information_age_threshold',
    'parent_age_threshold',
    'guardian_age_threshold',
    'parent_required_age',
    'guardian_required_age',
    'require_parent_info_under_age',
    'require_guardian_info_under_age'
]);

function normalizeText(value) {
    return String(value ?? '')
        .trim()
        .toLowerCase()
        .replace(/[أإآ]/g, 'ا')
        .replace(/ؤ/g, 'و')
        .replace(/ئ/g, 'ي')
        .replace(/ة/g, 'ه')
        .replace(/ى/g, 'ي')
        .replace(/[_-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function flattenConfigGroups(configGroups) {
    if (!Array.isArray(configGroups)) return [];
    return configGroups.flatMap(group => (Array.isArray(group) ? group : [group])).filter(Boolean);
}

function parsePositiveAgeThreshold(value) {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue) || numericValue <= 0) {
        return null;
    }
    return numericValue;
}

function isParentInfoThresholdConfig(config) {
    const key = normalizeText(config?.key);
    const label = normalizeText(config?.label);

    if (PARENT_INFO_THRESHOLD_KEY_ALIASES.has(key)) {
        return true;
    }

    return (
        label.includes('يجب ادخال بيانات ولي الامر') ||
        label.includes('بيانات ولي الامر') ||
        label.includes('guardian information') ||
        label.includes('parent information') ||
        label.includes('less than') ||
        label.includes('اقل من')
    );
}

export function resolveParentInfoAgeThreshold(configGroups) {
    const configs = flattenConfigGroups(configGroups);
    const matchedConfig = configs.find(isParentInfoThresholdConfig);
    const resolvedValue = parsePositiveAgeThreshold(matchedConfig?.value);
    return resolvedValue ?? DEFAULT_PARENT_INFO_AGE_THRESHOLD;
}
