import { useQueryClient } from '@tanstack/react-query';
import { entityActivitiesService } from '../services/entityActivities.service';
import { API_KEYS } from '../endpoints';
import useCustomQuery from '../../utils/hooks/global/useCustomQuery';
import useCustomMutation from '../../utils/hooks/global/useCustomMutation';

export const useEntityActivitiesQuery = (params = {}, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.ENTITY_ACTIVITIES, params],
        queryFn: () => entityActivitiesService.getEntityActivities(params),
        ...options
    });
};

export const useEntityActivityQuery = (id, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.ENTITY_ACTIVITIES, id],
        queryFn: () => entityActivitiesService.getEntityActivity(id),
        ...options
    });
};

export const useCreateEntityActivityMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data => entityActivitiesService.createEntityActivity(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.ENTITY_ACTIVITIES]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useUpdateEntityActivityMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data =>
            entityActivitiesService.updateEntityActivity(data.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.ENTITY_ACTIVITIES]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useDeleteEntityActivityMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: id => entityActivitiesService.deleteEntityActivity(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.ENTITY_ACTIVITIES]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};
