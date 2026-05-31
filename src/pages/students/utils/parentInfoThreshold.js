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

function collectTexts(value) {
    if (value == null) return [];

    if (typeof value === 'string' || typeof value === 'number') {
        const normalized = normalizeText(value);
        return normalized ? [normalized] : [];
    }

    if (Array.isArray(value)) {
        return value.flatMap(collectTexts);
    }

    if (typeof value === 'object') {
        return Object.values(value).flatMap(collectTexts);
    }

    return [];
}

function flattenConfigGroups(configGroups) {
    if (!Array.isArray(configGroups)) return [];
    return configGroups
        .flatMap(group => (Array.isArray(group) ? group : [group]))
        .filter(Boolean);
}

function parsePositiveAgeThreshold(value) {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue) || numericValue <= 0) {
        return null;
    }
    return numericValue;
}

function isParentInfoThresholdConfig(config) {
    const searchableTexts = [
        ...collectTexts(config?.key),
        ...collectTexts(config?.label),
        ...collectTexts(config?.name),
        ...collectTexts(config?.title),
        ...collectTexts(config?.description)
    ];

    if (searchableTexts.some(text => PARENT_INFO_THRESHOLD_KEY_ALIASES.has(text))) {
        return true;
    }

    return searchableTexts.some(text =>
        text.includes('يجب ادخال بيانات ولي الامر') ||
        text.includes('بيانات ولي الامر') ||
        text.includes('parent information') ||
        text.includes('guardian information') ||
        text.includes('اقل من') ||
        text.includes('less than') ||
        text.includes('under age')
    );
}

export function resolveParentInfoAgeThreshold(configGroups) {
    const configs = flattenConfigGroups(configGroups);
    const matchedConfig = configs.find(isParentInfoThresholdConfig);
    const resolvedValue = parsePositiveAgeThreshold(matchedConfig?.value);
    return resolvedValue ?? DEFAULT_PARENT_INFO_AGE_THRESHOLD;
}
