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

            setLanguage: async language => {
                try {
                    await i18n.changeLanguage(language);
                    const isRTL = language === 'ar';

                    // Update document direction and language
                    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
                    document.documentElement.lang = language;

                    set({ language, isRTL });

                    // Update user locale on server
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
