import i18n from '@/i18n';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useUserStore } from './user.store';
import { axiosInstance } from '@/api/axiosInstance';

const useLanguageStore = create(
    persist(
        (set, get) => ({
            language: localStorage.getItem('i18nextLng') || 'ar',
            isRTL: false,

            setLanguage: async (language, skipApiCall = false) => {
                try {
                    await i18n.changeLanguage(language);
                    const isRTL = language === 'ar';

                    // Update document direction and language
                    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
                    document.documentElement.lang = language;

                    set({ language, isRTL });

                    // Update user locale on server (skip if flag is set)
                    if (!skipApiCall) {
                        const user = useUserStore.getState().user;
                        if (user?.id) {
                            try {
                                // Send as x-www-form-urlencoded format
                                const formData = new URLSearchParams();
                                formData.append('locale', language);
                                
                                await axiosInstance.put(
                                    '/profile/locale',
                                    formData.toString(),
                                    {
                                        headers: {
                                            'Content-Type': 'application/x-www-form-urlencoded'
                                        }
                                    }
                                );
                            } catch (error) {
                                console.error('Error updating user locale:', error);
                            }
                        }
                    }

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
            },

            clearLanguage: () => {
                // Clear language from localStorage
                localStorage.removeItem('language-storage');
                localStorage.removeItem('i18nextLng');
                
                // Reset to default language (ar) for the session only
                // Don't update store state to avoid persist middleware re-saving it
                // The next login will set the language from user's preference
                const defaultLanguage = 'ar';
                i18n.changeLanguage(defaultLanguage);
                document.documentElement.dir = 'rtl';
                document.documentElement.lang = defaultLanguage;
                
                // Note: We don't call set() here to avoid persist middleware
                // re-saving 'ar' to localStorage. The store will be updated on next login.
            }
        }),
        {
            name: 'language-storage', // unique name for localStorage key
            partialize: state => ({ language: state.language }) // only persist language
        }
    )
);

export default useLanguageStore;
