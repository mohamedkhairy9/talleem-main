import { useTranslation } from 'react-i18next';

export default function useLocale(path = '') {
    const { t, i18n } = useTranslation(path);
    const currentLocale = i18n.language || 'en';

    const changeLocale = lng => {
        i18n.changeLanguage(lng);
    };

    const isRTL = currentLocale === 'ar';

    return {
        t,
        currentLocale,
        changeLocale,
        isRTL
    };
}
