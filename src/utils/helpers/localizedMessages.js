import i18next from '@/i18n';

const ENGLISH_MESSAGE_KEY_MAP = {
    unauthorized: 'api.errors.unauthorized',
    unauthenticated: 'api.errors.unauthorized',
    'unauthenticated.': 'api.errors.unauthorized',
    forbidden: 'api.errors.unauthorized',
    'not found': 'api.errors.not_found',
    'the requested resource was not found.': 'api.errors.not_found',
    'network error': 'api.errors.network',
    'failed to fetch': 'api.errors.network',
    'server error': 'api.errors.server',
    'internal server error': 'api.errors.server',
    'something went wrong': 'api.errors.generic',
    'something went wrong. please try again.': 'api.errors.generic',
    'the given data was invalid.': 'api.errors.validation',
    'validation error': 'api.errors.validation'
};

const getDefaultFallbackKey = status => {
    switch (status) {
        case 401:
        case 403:
            return 'api.errors.unauthorized';
        case 404:
            return 'api.errors.not_found';
        case 422:
            return 'api.errors.validation';
        case 500:
        case 502:
        case 503:
            return 'api.errors.server';
        default:
            return 'api.errors.generic';
    }
};

const isTranslationKey = message =>
    typeof message === 'string' &&
    message.includes('.') &&
    /^[a-z0-9_.-]+$/i.test(message.trim());

const isMostlyEnglish = message =>
    typeof message === 'string' &&
    /[A-Za-z]/.test(message) &&
    /^[\x00-\x7F\s.,:;!?()[\]{}'"`/_-]+$/.test(message);

const translateIfKey = message => {
    if (!isTranslationKey(message)) return null;

    const translated = i18next.t(message, { defaultValue: message });
    return translated !== message ? translated : null;
};

const translateKnownEnglishMessage = message => {
    if (typeof message !== 'string') return null;

    const normalized = message.trim().toLowerCase();
    const key = ENGLISH_MESSAGE_KEY_MAP[normalized];
    return key ? i18next.t(key) : null;
};

export const getRawErrorMessage = error =>
    error?.rawMessage ||
    error?.message ||
    error?.data?.message ||
    error?.data?.error ||
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    '';

export const localizeMessage = (
    message,
    fallbackKey = 'api.errors.generic',
    { preferFallbackForEnglish = false } = {}
) => {
    if (!message) {
        return i18next.t(fallbackKey);
    }

    const keyTranslation = translateIfKey(message);
    if (keyTranslation) {
        return keyTranslation;
    }

    const knownEnglishTranslation = translateKnownEnglishMessage(message);
    if (knownEnglishTranslation) {
        return knownEnglishTranslation;
    }

    if (preferFallbackForEnglish && i18next.language === 'ar' && isMostlyEnglish(message)) {
        return i18next.t(fallbackKey);
    }

    return message;
};

export const getLocalizedErrorMessage = (
    error,
    fallbackKey = null
) => {
    const status = error?.status || error?.response?.status;
    const resolvedFallbackKey = fallbackKey || getDefaultFallbackKey(status);
    const rawMessage = getRawErrorMessage(error);

    return localizeMessage(rawMessage, resolvedFallbackKey, {
        preferFallbackForEnglish: true
    });
};
