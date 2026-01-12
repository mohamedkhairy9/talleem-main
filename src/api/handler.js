import { toast } from 'react-toastify';
import i18next from '../i18n';

/**
 * Get localized message
 * @param {string} message - Message from API (could be a translation key or plain text)
 * @param {string} fallbackKey - Fallback translation key if message is not found
 * @returns {string} Localized message
 */
const getLocalizedMessage = (message, fallbackKey) => {
    if (!message) {
        return i18next.t(fallbackKey);
    }

    // Check if message is a translation key (starts with common prefixes)
    const translationKeyPatterns = [
        'validation.',
        'api.',
        'common.',
        'errors.',
        'success.'
    ];

    const isTranslationKey = translationKeyPatterns.some(pattern => 
        message.startsWith(pattern)
    );

    if (isTranslationKey) {
        // Try to translate it
        const translated = i18next.t(message, { defaultValue: message });
        // If translation returns the key itself, it means translation not found
        return translated !== message ? translated : i18next.t(fallbackKey);
    }

    // If message is not a translation key, use it as-is
    // (assuming backend already returns localized messages based on Accept-Language header)
    return message;
};

/**
 * Get appropriate error message based on error status
 * @param {Object} error - Error object
 * @returns {string} Localized error message
 */
const getErrorMessage = (error) => {
    // Check for error message in various locations and formats
    const errorMessage = 
        error?.message || 
        error?.data?.message || 
        error?.data?.error || 
        error?.response?.data?.message || 
        error?.response?.data?.error;
    
    if (errorMessage) {
        return getLocalizedMessage(errorMessage, 'api.errors.generic');
    }

    // Map HTTP status codes to translation keys
    const status = error?.status || error?.response?.status;
    if (status) {
        switch (status) {
            case 401:
                return i18next.t('api.errors.unauthorized');
            case 404:
                return i18next.t('api.errors.not_found');
            case 422:
                return i18next.t('api.errors.validation');
            case 500:
            case 502:
            case 503:
                return i18next.t('api.errors.server');
            default:
                return i18next.t('api.errors.generic');
        }
    }

    // Network errors
    if (error?.code === 'NETWORK_ERROR' || error?.message?.includes('Network')) {
        return i18next.t('api.errors.network');
    }

    return i18next.t('api.errors.generic');
};

export const errorHandler = error => {
    const localizedMessage = getErrorMessage(error);
    toast.error(localizedMessage);
};

export const successHandler = message => {
    const localizedMessage = getLocalizedMessage(message, 'api.success.generic');
    toast.success(localizedMessage);
};
