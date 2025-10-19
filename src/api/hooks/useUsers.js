import { useQueryClient } from '@tanstack/react-query';
import { usersService } from '../services/users.service';
import { API_KEYS } from '../endpoints';
import useCustomQuery from '../../utils/hooks/global/useCustomQuery';
import useCustomMutation from '../../utils/hooks/global/useCustomMutation';

export const useUsersQuery = params => {
    return useCustomQuery({
        queryKey: [API_KEYS.USERS, params],
        queryFn: () => usersService.getUsers(params)
    });
};

export const useUserQuery = id => {
    return useCustomQuery({
        queryKey: [API_KEYS.USERS, id],
        queryFn: () => usersService.getUser(id)
    });
};

export const useCreateUserMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data => usersService.createUser(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [API_KEYS.USERS] });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useUpdateUserMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data => usersService.updateUser(data.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [API_KEYS.USERS] });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useDeleteUserMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: id => usersService.deleteUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [API_KEYS.USERS] });
        },
        onError: error => {
            console.log(error);
        }
    });
};
