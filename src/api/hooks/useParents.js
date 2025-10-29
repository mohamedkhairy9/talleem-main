import { useQueryClient } from '@tanstack/react-query';
import { parentsService } from '../services/parents.service';
import { API_KEYS } from '../endpoints';
import useCustomQuery from '../../utils/hooks/global/useCustomQuery';
import useCustomMutation from '../../utils/hooks/global/useCustomMutation';

export const useParentsQuery = (params = {}, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.PARENTS, params],
        queryFn: () => parentsService.getParents(params),
        ...options
    });
};

export const useParentQuery = (id, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.PARENTS, id],
        queryFn: () => parentsService.getParent(id),
        ...options
    });
};

export const useCreateParentMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data => parentsService.createParent(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.PARENTS]
            });
        }
    });
};

export const useUpdateParentMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data => parentsService.updateParent(data.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.PARENTS]
            });
        }
    });
};

export const useDeleteParentMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: id => parentsService.deleteParent(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.PARENTS]
            });
        }
    });
};
