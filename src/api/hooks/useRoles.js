import { useQueryClient } from '@tanstack/react-query';
import { rolesService } from '../services/roles.service';
import { API_KEYS } from '../endpoints';
import useCustomQuery from '../../utils/hooks/global/useCustomQuery';
import useCustomMutation from '../../utils/hooks/global/useCustomMutation';

export const useRolesQuery = params => {
    return useCustomQuery({
        queryKey: [API_KEYS.ROLES, params],
        queryFn: () => rolesService.getRoles(params)
    });
};

export const useRoleQuery = id => {
    return useCustomQuery({
        queryKey: [API_KEYS.ROLES, id],
        queryFn: () => rolesService.getRole(id)
    });
};

export const useCreateRoleMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: ({ data }) => rolesService.createRole(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [API_KEYS.ROLES] });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useUpdateRoleMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: ({ data }) => rolesService.updateRole(data.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [API_KEYS.ROLES] });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useDeleteRoleMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: ({ id }) => rolesService.deleteRole(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [API_KEYS.ROLES] });
        },
        onError: error => {
            console.log(error);
        }
    });
};
