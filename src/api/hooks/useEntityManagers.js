import { useQueryClient } from '@tanstack/react-query';
import { entityManagersService } from '../services/entityManagers.service';
import { API_KEYS } from '../endpoints';
import useCustomQuery from '../../utils/hooks/global/useCustomQuery';
import useCustomMutation from '../../utils/hooks/global/useCustomMutation';

export const useEntityManagersQuery = params => {
    return useCustomQuery({
        queryKey: [API_KEYS.ENTITY_MANAGERS, params],
        queryFn: () => entityManagersService.getEntityManagers(params)
    });
};

export const useEntityManagerQuery = id => {
    return useCustomQuery({
        queryKey: [API_KEYS.ENTITY_MANAGERS, id],
        queryFn: () => entityManagersService.getEntityManager(id)
    });
};

export const useCreateEntityManagerMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data => entityManagersService.createEntityManager(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [API_KEYS.ENTITY_MANAGERS] });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useUpdateEntityManagerMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data => entityManagersService.updateEntityManager(data.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [API_KEYS.ENTITY_MANAGERS] });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useDeleteEntityManagerMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: id => entityManagersService.deleteEntityManager(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [API_KEYS.ENTITY_MANAGERS] });
        },
        onError: error => {
            console.log(error);
        }
    });
};

