import { useQueryClient } from '@tanstack/react-query';
import { entityCategoriesService } from '../services/entityCategories.service';
import { API_KEYS } from '../endpoints';
import useCustomQuery from '../../utils/hooks/global/useCustomQuery';
import useCustomMutation from '../../utils/hooks/global/useCustomMutation';

export const useEntityCategoriesQuery = params => {
    return useCustomQuery({
        queryKey: [API_KEYS.ENTITY_CATEGORIES, params],
        queryFn: () => entityCategoriesService.getEntityCategories(params)
    });
};

export const useEntityCategoryQuery = id => {
    return useCustomQuery({
        queryKey: [API_KEYS.ENTITY_CATEGORIES, id],
        queryFn: () => entityCategoriesService.getEntityCategory(id)
    });
};

export const useCreateEntityCategoryMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data => entityCategoriesService.createEntityCategory(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.ENTITY_CATEGORIES]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useUpdateEntityCategoryMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data =>
            entityCategoriesService.updateEntityCategory(data.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.ENTITY_CATEGORIES]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useDeleteEntityCategoryMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: id => entityCategoriesService.deleteEntityCategory(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.ENTITY_CATEGORIES]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};
