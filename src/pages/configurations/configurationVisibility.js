const HIDDEN_CONFIGURATION_KEYS_BY_PROGRAM = {
    tahfiz: new Set(['max_allowed_absences_with_excuse'])
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
    if (config?.program !== 'tahfiz') {
        return config?.label;
    }

    const labels = TEACHER_LEAVE_LABELS_BY_KEY[config?.key];

    return labels?.[normalizeLanguage(language)] || config?.label;
}

function withDisplayLabel(config, language) {
    const label = getConfigurationDisplayLabel(config, language);

    return label === config?.label ? config : { ...config, label };
}

export function getVisibleConfigurationGroups(groups = [], language = 'en') {
    return groups
        .map(group => group
            .filter(isVisibleConfiguration)
            .map(config => withDisplayLabel(config, language)))
        .filter(group => group.length > 0);
}
