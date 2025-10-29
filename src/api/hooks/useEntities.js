import { useQueryClient } from '@tanstack/react-query';
import { entitiesService } from '../services/entities.service';
import { API_KEYS } from '../endpoints';
import useCustomQuery from '../../utils/hooks/global/useCustomQuery';
import useCustomMutation from '../../utils/hooks/global/useCustomMutation';
import { prepareFormData } from '@/utils/helpers/global.fns';

export const useEntitiesQuery = (params = {}, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.ENTITIES, params],
        queryFn: () => entitiesService.getEntities(params),
        ...options
    });
};

export const useEntityQuery = (id, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.ENTITIES, id],
        queryFn: () => entitiesService.getEntity(id),
        ...options
    });
};

export const useCreateEntityMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data => entitiesService.createEntity(prepareFormData(data)),
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
        mutationFn: data =>
            entitiesService.updateEntity(data.id, prepareFormData(data)),
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
