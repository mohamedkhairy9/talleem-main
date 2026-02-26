import { useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { useUserStore } from '../../utils/stores/user.store';
import useLanguageStore from '../../utils/stores/language.store';
import useCustomMutation from '../../utils/hooks/global/useCustomMutation';
import i18n from '../../i18n';

export const useLoginMutation = () => {
    const setUser = useUserStore(state => state.setUser);
    
    return useCustomMutation({
        mutationFn: data => authService.login(data),
        onSuccess: async ({ data }) => {
            console.log('data', data);
            setUser(data.user, data.access_token);
            
            // Handle user locale after login - always set from server response
            const userLocale = data.user?.locale  // || data.user?.current_app_locale ;
            console.log('User locale from login response:', userLocale);
            
            if (userLocale) {
                const languageStore = useLanguageStore.getState();
                const { language: currentLanguage, setLanguage } = languageStore;
                console.log('Current language in store:', currentLanguage);
                console.log('Current i18n language:', i18n.language);
                console.log('User locale from server:', userLocale);
                
                // Always set the language from user's locale preference
                // The user's server preference should always take precedence
                // Only skip API call if language is already the same (to avoid unnecessary API calls)
                const shouldCallApi = userLocale !== currentLanguage;
                console.log('Setting language to user locale:', userLocale, 'shouldCallApi:', shouldCallApi);
                
                // Always call setLanguage to ensure everything is in sync
                await setLanguage(userLocale, !shouldCallApi);
                
                // Verify it was set correctly
                const updatedStore = useLanguageStore.getState();
                console.log('Language after setting - store:', updatedStore.language);
                console.log('i18n language after setting:', i18n.language);
                console.log('Document dir after setting:', document.documentElement.dir);
                console.log('Document lang after setting:', document.documentElement.lang);
            }
        }
    });
};

export const useLogoutMutation = () => {
    const queryClient = useQueryClient();
    const clearUser = useUserStore(state => state.clearUser);

    const clearSession = () => {
        clearUser();
        useLanguageStore.getState().clearLanguage();
        // Clear all React Query cache so the next user does not see previous user's data
        queryClient.clear();
    };

    return useCustomMutation({
        mutationFn: () => authService.logout(),
        onSuccess: clearSession,
        onError: clearSession
    });
};
