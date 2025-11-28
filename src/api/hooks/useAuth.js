import { authService } from '../services/auth.service';
import { useUserStore } from '../../utils/stores/user.store';
import useCustomMutation from '../../utils/hooks/global/useCustomMutation';

export const useLoginMutation = () => {
    const setUser = useUserStore(state => state.setUser);
    return useCustomMutation({
        mutationFn: data => authService.login(data),
        onSuccess: ({ data }) => {
            console.log('data', data);
            setUser(data.user, data.access_token);
        }
    });
};

export const useLogoutMutation = () => {
    const clearUser = useUserStore(state => state.clearUser);
    return useCustomMutation({
        mutationFn: () => authService.logout(),
        onSuccess: () => {
            clearUser();
        },
        onError: () => {
            clearUser();
        }
    });
};
