const TEXT_KEYS = ['en', 'ar', 'name', 'label', 'display_name', 'title', 'value', 'slug'];

function normalizeSearchText(value) {
    return String(value ?? '')
        .trim()
        .toLowerCase()
        .replace(/[_-]+/g, ' ')
        .replace(/[^\p{L}\p{N}\s]/gu, ' ')
        .replace(/[أإآ]/g, 'ا')
        .replace(/ؤ/g, 'و')
        .replace(/ئ/g, 'ي')
        .replace(/ة/g, 'ه')
        .replace(/ى/g, 'ي')
        .replace(/\s+/g, ' ')
        .trim();
}

function collectTexts(value) {
    if (value == null) return [];

    if (typeof value === 'string' || typeof value === 'number') {
        const normalized = normalizeSearchText(value);
        return normalized ? [normalized] : [];
    }

    if (Array.isArray(value)) {
        return value.flatMap(collectTexts);
    }

    if (typeof value === 'object') {
        return TEXT_KEYS.flatMap(key => collectTexts(value[key]));
    }

    const normalized = normalizeSearchText(value);
    return normalized ? [normalized] : [];
}

function uniqueTexts(values) {
    return [...new Set(values.filter(Boolean))];
}

function containsAllWords(text, words) {
    return words.every(word => text.includes(word));
}

const SUPERVISOR_ROLE_MATCHER = text => text.includes('supervisor') || text === 'مشرف';

const EXCLUDED_ROLE_MATCHERS = [
    text => text.includes('teacher') || text === 'معلم' || text === 'مدرس',
    text => text.includes('student') || text === 'طالب',
    text => text.includes('parent') || text === 'ولي امر',
    text =>
        (text === 'entity' || text === 'جهه' || text === 'كيان') &&
        !containsAllWords(text, ['entity', 'manager']) &&
        !containsAllWords(text, ['مدير', 'جهه']) &&
        !containsAllWords(text, ['مدير', 'كيان']) &&
        !containsAllWords(text, ['مسؤول', 'جهه']),
    SUPERVISOR_ROLE_MATCHER,
    text =>
        containsAllWords(text, ['entity', 'manager']) ||
        containsAllWords(text, ['مدير', 'جهه']) ||
        containsAllWords(text, ['مدير', 'كيان']) ||
        containsAllWords(text, ['مسؤول', 'جهه'])
];

const EMPLOYEE_EXCLUDED_ROLE_MATCHERS = EXCLUDED_ROLE_MATCHERS.filter(
    matchesExcludedRole => matchesExcludedRole !== SUPERVISOR_ROLE_MATCHER
);

export function extractSearchableTexts(...values) {
    return uniqueTexts(values.flatMap(collectTexts));
}

export function normalizeRoleName(name) {
    return extractSearchableTexts(name).join(' ');
}

export function isAssignableRole(role) {
    if (!role) return true;

    const searchableTexts = extractSearchableTexts(
        role.name,
        role.display_name,
        role.label,
        role.slug
    );
    if (!searchableTexts.length) return true;

    return !searchableTexts.some(text =>
        EXCLUDED_ROLE_MATCHERS.some(matchesExcludedRole => matchesExcludedRole(text))
    );
}

export function filterAssignableRoles(roles) {
    if (!Array.isArray(roles)) return [];
    return roles.filter(isAssignableRole);
}

export function isEmployeeAssignableRole(role) {
    if (!role) return true;

    const searchableTexts = extractSearchableTexts(
        role.name,
        role.display_name,
        role.label,
        role.slug,
        role.code
    );
    if (!searchableTexts.length) return true;

    return !searchableTexts.some(text =>
        EMPLOYEE_EXCLUDED_ROLE_MATCHERS.some(matchesExcludedRole => matchesExcludedRole(text))
    );
}

export function filterEmployeeAssignableRoles(roles) {
    if (!Array.isArray(roles)) return [];
    return roles.filter(isEmployeeAssignableRole);
}
