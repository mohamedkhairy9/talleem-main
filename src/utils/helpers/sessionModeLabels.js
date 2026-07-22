const isHybridSessionMode = value => {
    const normalizedValue = String(value ?? '').trim().toLowerCase();

    return normalizedValue === 'hybrid' || normalizedValue === 'هجين';
};

export const getSessionModeDisplayName = (name, locale = 'en') => {
    const language = String(locale || 'en').split('-')[0];
    const localizedName =
        typeof name === 'object' && name !== null
            ? name?.[locale] || name?.[language] || name?.en || name?.ar || ''
            : name;

    return isHybridSessionMode(localizedName)
        ? language === 'ar'
            ? 'مدمج'
            : 'Blended'
        : localizedName || '';
};

// Keep the API identifier intact while standardizing the legacy Hybrid label in UI options.
export const normalizeSessionModeOptions = (sessionModes = []) =>
    (sessionModes || []).map(sessionMode => {
        const name = sessionMode?.name;
        const names =
            typeof name === 'object' && name !== null
                ? Object.values(name)
                : [name];

        if (!names.some(isHybridSessionMode)) {
            return sessionMode;
        }

        return {
            ...sessionMode,
            name: {
                ...(typeof name === 'object' && name !== null ? name : {}),
                en: 'Blended',
                ar: 'مدمج'
            }
        };
    });
