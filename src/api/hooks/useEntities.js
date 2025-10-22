import { useQueryClient } from '@tanstack/react-query';
import { entitiesService } from '../services/entities.service';
import { API_KEYS } from '../endpoints';
import useCustomQuery from '../../utils/hooks/global/useCustomQuery';
import useCustomMutation from '../../utils/hooks/global/useCustomMutation';

export const useEntitiesQuery = params => {
    return useCustomQuery({
        queryKey: [API_KEYS.ENTITIES, params],
        queryFn: () => entitiesService.getEntities(params)
    });
};

export const useEntityQuery = id => {
    return useCustomQuery({
        queryKey: [API_KEYS.ENTITIES, id],
        queryFn: () => entitiesService.getEntity(id)
    });
};

export const useCreateEntityMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data => entitiesService.createEntity(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [API_KEYS.ENTITIES] });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useUpdateEntityMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data => entitiesService.updateEntity(data.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [API_KEYS.ENTITIES] });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useDeleteEntityMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: id => entitiesService.deleteEntity(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [API_KEYS.ENTITIES] });
        },
        onError: error => {
            console.log(error);
        }
    });
};
