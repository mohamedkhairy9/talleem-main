const HIDDEN_CONFIGURATION_KEYS_BY_PROGRAM = {
    tahfiz: new Set(['max_allowed_absences_with_excuse'])
};

const EDITABLE_MIN_STUDENT_AGE_KEY = 'editable_min_student_age';
const EDITABLE_MIN_STUDENT_AGE_LABELS = {
    ar: 'مع إمكانية التعديل',
    en: 'Editable minimum student age'
};

const TEACHER_LEAVE_LABELS_BY_KEY = {
    annual_leave_days: {
        ar: 'إجازات المعلم السنوية (أيام)',
        en: 'Teacher Annual Leave (Days)'
    },
    sick_leave_days: {
        ar: 'إجازات المعلم المرضية (أيام)',
        en: 'Teacher Sick Leave (Days)'
    },
    other_leave_days: {
        ar: 'إجازات المعلم الأخرى (أيام)',
        en: 'Teacher Other Leave (Days)'
    }
};

function normalizeLanguage(language) {
    return String(language || '').startsWith('ar') ? 'ar' : 'en';
}

export function isVisibleConfiguration(config) {
    const hiddenKeys = HIDDEN_CONFIGURATION_KEYS_BY_PROGRAM[config?.program];

    return !hiddenKeys?.has(config?.key);
}

export function getConfigurationDisplayLabel(config, language = 'en') {
    if (config?.key === EDITABLE_MIN_STUDENT_AGE_KEY) {
        return config?.label || EDITABLE_MIN_STUDENT_AGE_LABELS[normalizeLanguage(language)];
    }

    if (config?.program !== 'tahfiz') {
        return config?.label;
    }

    const labels = TEACHER_LEAVE_LABELS_BY_KEY[config?.key];

    return labels?.[normalizeLanguage(language)] || config?.label;
}

function withDisplayLabel(config, language) {
    const normalizedConfig =
        config?.key === EDITABLE_MIN_STUDENT_AGE_KEY
            ? {
                  ...config,
                  type: config.type || 'checkbox',
                  value: config.value ?? '1'
              }
            : config;
    const label = getConfigurationDisplayLabel(normalizedConfig, language);

    return label === normalizedConfig?.label
        ? normalizedConfig
        : { ...normalizedConfig, label };
}

function addMissingEditableMinimumStudentAgeConfiguration(groups, language) {
    return groups.map(group => {
        const hasMinimumStudentAge = group.some(
            config => config?.key === 'min_student_age'
        );
        const hasEditableMinimumStudentAge = group.some(
            config => config?.key === EDITABLE_MIN_STUDENT_AGE_KEY
        );
        const isTahfizGroup = group.some(config => config?.program === 'tahfiz');

        if (
            !isTahfizGroup ||
            !hasMinimumStudentAge ||
            hasEditableMinimumStudentAge
        ) {
            return group;
        }

        return [
            ...group,
            {
                id: EDITABLE_MIN_STUDENT_AGE_KEY,
                program: 'tahfiz',
                key: EDITABLE_MIN_STUDENT_AGE_KEY,
                label: EDITABLE_MIN_STUDENT_AGE_LABELS[normalizeLanguage(language)],
                value: '1',
                type: 'checkbox'
            }
        ];
    });
}

export function getVisibleConfigurationGroups(groups = [], language = 'en') {
    const normalizedGroups = Array.isArray(groups)
        ? groups.filter(Array.isArray)
        : [];

    return addMissingEditableMinimumStudentAgeConfiguration(
        normalizedGroups,
        language
    )
        .map(group => group
            .filter(isVisibleConfiguration)
            .map(config => withDisplayLabel(config, language)))
        .filter(group => group.length > 0);
}
