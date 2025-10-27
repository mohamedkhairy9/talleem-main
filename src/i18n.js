import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';

i18n.use(HttpApi)
    .use(initReactI18next)
    .init({
        supportedLngs: ['en', 'ar'],
        fallbackLng: 'en',
        lng: localStorage.getItem('language-storage')
            ? JSON.parse(localStorage.getItem('language-storage')).state
                  ?.language || 'ar'
            : 'ar',
        debug: false, // Disable debug mode for production
        interpolation: {
            escapeValue: false
        },
        backend: {
            loadPath: '/locales/{{lng}}/translation.json'
        },
        react: {
            useSuspense: false // Disable suspense to prevent loading issues
        },
        load: 'languageOnly', // Only load language, not region
        cleanCode: true // Clean language codes
    });

export default i18n;
