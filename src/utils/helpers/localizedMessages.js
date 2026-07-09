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
    /^[ -~\s]+$/.test(message);

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

const translateAxiosStatusMessage = (message, fallbackKey) => {
    if (typeof message !== 'string') return null;

    const normalized = message.trim().toLowerCase();
    if (/^request failed with status code \d+$/.test(normalized)) {
        return fallbackKey ? i18next.t(fallbackKey) : null;
    }

    return null;
};

const translateRenewalWindowMessage = message => {
    if (typeof message !== 'string') return null;

    const match = message.match(
        /you are not allowed to renew the license at this time\.\s*you can renew from\s*(\d{4}-\d{2}-\d{2})\s*\(within 30 days before expiry\)\.?/i
    );

    if (!match) return null;

    return i18next.t('api.errors.renewal_not_allowed_before_date', {
        date: match[1]
    });
};

const translateLicenseDomainMessage = message => {
    if (typeof message !== 'string') return null;

    const normalized = message.trim().toLowerCase();

    if (
        normalized.includes('license') &&
        normalized.includes('already') &&
        normalized.includes('issued') &&
        normalized.includes('teacher')
    ) {
        return i18next.t('api.errors.teacher_license_already_issued');
    }

    if (
        normalized.includes('license') &&
        normalized.includes('already') &&
        normalized.includes('issued') &&
        normalized.includes('entity')
    ) {
        return i18next.t('api.errors.entity_license_already_issued');
    }

    if (
        normalized.includes('license') &&
        normalized.includes('already') &&
        normalized.includes('issued')
    ) {
        return i18next.t('api.errors.license_already_issued');
    }

    if (
        normalized.includes('already active') ||
        (normalized.includes('status') && normalized.includes('active')) ||
        (normalized.includes('record') && normalized.includes('active'))
    ) {
        return i18next.t('api.errors.record_already_active');
    }

    return null;
};

const translateDatabaseConstraintMessage = message => {
    if (typeof message !== 'string') return null;

    const normalized = message.trim().toLowerCase();

    if (
        normalized.includes('duplicate entry') &&
        (normalized.includes('users_email_unique') ||
            normalized.includes("'email'") ||
            normalized.includes(' email '))
    ) {
        return i18next.language === 'ar'
            ? 'البريد الإلكتروني مستخدم بالفعل'
            : 'This email address is already in use';
    }

    return null;
};

const extractNestedErrorMessage = errorsObject => {
    if (!errorsObject || typeof errorsObject !== 'object') return '';

    const firstErrorGroup = Object.values(errorsObject).find(
        value => value !== undefined && value !== null && value !== ''
    );

    if (Array.isArray(firstErrorGroup)) {
        return firstErrorGroup.find(
            value => typeof value === 'string' && value.trim() !== ''
        ) || '';
    }

    return typeof firstErrorGroup === 'string' ? firstErrorGroup : '';
};

export const getRawErrorMessage = error =>
    error?.rawMessage ||
    error?.data?.message ||
    error?.data?.error ||
    extractNestedErrorMessage(error?.data?.errors) ||
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    extractNestedErrorMessage(error?.response?.data?.errors) ||
    error?.message ||
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

    const axiosStatusTranslation = translateAxiosStatusMessage(
        message,
        fallbackKey
    );
    if (axiosStatusTranslation) {
        return axiosStatusTranslation;
    }

    const renewalWindowTranslation = translateRenewalWindowMessage(message);
    if (renewalWindowTranslation) {
        return renewalWindowTranslation;
    }

    const licenseDomainTranslation = translateLicenseDomainMessage(message);
    if (licenseDomainTranslation) {
        return licenseDomainTranslation;
    }

    const databaseConstraintTranslation =
        translateDatabaseConstraintMessage(message);
    if (databaseConstraintTranslation) {
        return databaseConstraintTranslation;
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

    return localizeMessage(rawMessage, resolvedFallbackKey);
};
