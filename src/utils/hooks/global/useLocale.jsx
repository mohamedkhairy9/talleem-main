import { useTranslation } from 'react-i18next';
import useLanguageStore from '../../stores/language.store';

export default function useLocale(path = '') {
    const { t, i18n } = useTranslation(path);
    const { language: currentLocale, isRTL, setLanguage } = useLanguageStore();

    const changeLocale = lng => {
        setLanguage(lng);
    };

    return {
        t,
        currentLocale,
        changeLocale,
        isRTL
    };
}
