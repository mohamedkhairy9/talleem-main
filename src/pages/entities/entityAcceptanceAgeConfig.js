const DEFAULT_MIN_STUDENT_AGE = 2;
const MIN_STUDENT_AGE_KEY = 'min_student_age';
const EDITABLE_MIN_STUDENT_AGE_KEY = 'editable_min_student_age';

function flattenConfigurationGroups(groups) {
    if (!Array.isArray(groups)) return [];

    return groups.flatMap(group => (Array.isArray(group) ? group : [group]));
}

function toPositiveNumber(value, fallback) {
    const parsed = Number(value);

    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function toBoolean(value, fallback = true) {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value === 1;

    if (typeof value === 'string') {
        const normalized = value.trim().toLowerCase();

        if (['1', 'true', 'yes', 'on'].includes(normalized)) return true;
        if (['0', 'false', 'no', 'off'].includes(normalized)) return false;
    }

    return fallback;
}

/**
 * Reads the Tahfiz acceptance-age settings returned by /configurations.
 * The defaults match the server-side defaults, so the create form never
 * falls back to the old hard-coded value of one year while data is loading.
 */
export function resolveEntityAcceptanceAgeConfig(groups) {
    const configurations = flattenConfigurationGroups(groups);
    const minStudentAgeConfig = configurations.find(
        config => config?.key === MIN_STUDENT_AGE_KEY
    );
    const editableMinStudentAgeConfig = configurations.find(
        config => config?.key === EDITABLE_MIN_STUDENT_AGE_KEY
    );

    return {
        minStudentAge: toPositiveNumber(
            minStudentAgeConfig?.value,
            DEFAULT_MIN_STUDENT_AGE
        ),
        isMinStudentAgeEditable: toBoolean(
            editableMinStudentAgeConfig?.value,
            true
        )
    };
}
