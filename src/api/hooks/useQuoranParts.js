import { useQueryClient } from '@tanstack/react-query';
import { quoranPartsService } from '../services/quoranParts.service';
import { API_KEYS } from '../endpoints';
import useCustomQuery from '../../utils/hooks/global/useCustomQuery';
import useCustomMutation from '../../utils/hooks/global/useCustomMutation';

export const useQuoranPartsQuery = params => {
    return useCustomQuery({
        queryKey: [API_KEYS.QUORAN_PARTS, params],
        queryFn: () => quoranPartsService.getQuoranParts(params)
    });
};

export const useQuoranPartQuery = id => {
    return useCustomQuery({
        queryKey: [API_KEYS.QUORAN_PARTS, id],
        queryFn: () => quoranPartsService.getQuoranPart(id)
    });
};

export const useCreateQuoranPartMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data => quoranPartsService.createQuoranPart(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.QUORAN_PARTS]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useUpdateQuoranPartMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data => quoranPartsService.updateQuoranPart(data.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.QUORAN_PARTS]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useDeleteQuoranPartMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: id => quoranPartsService.deleteQuoranPart(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.QUORAN_PARTS]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};
