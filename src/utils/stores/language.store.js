import i18n from '@/i18n';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useLanguageStore = create(
    persist(
        (set, get) => ({
            language: localStorage.getItem('i18nextLng') || 'en',
            isRTL: false,

            setLanguage: async language => {
                try {
                    await i18n.changeLanguage(language);
                    const isRTL = language === 'ar';

                    // Update document direction and language
                    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
                    document.documentElement.lang = language;

                    set({ language, isRTL });

                    console.log('Language changed to:', language);
                } catch (error) {
                    console.error('Error changing language:', error);
                }
            },

            initializeLanguage: () => {
                const { language } = get();
                const isRTL = language === 'ar';

                // Set initial document direction
                document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
                document.documentElement.lang = language;

                set({ isRTL });
            }
        }),
        {
            name: 'language-storage', // unique name for localStorage key
            partialize: state => ({ language: state.language }) // only persist language
        }
    )
);

export default useLanguageStore;
