import { useQueryClient } from '@tanstack/react-query';
import { neighborhoodsService } from '../services/neighborhoods.service';
import { API_KEYS } from '../endpoints';
import useCustomQuery from '../../utils/hooks/global/useCustomQuery';
import useCustomMutation from '../../utils/hooks/global/useCustomMutation';

export const useNeighborhoodsQuery = params => {
    return useCustomQuery({
        queryKey: [API_KEYS.NEIGHBORHOODS, params],
        queryFn: () => neighborhoodsService.getNeighborhoods(params)
    });
};

export const useNeighborhoodQuery = id => {
    return useCustomQuery({
        queryKey: [API_KEYS.NEIGHBORHOODS, id],
        queryFn: () => neighborhoodsService.getNeighborhood(id)
    });
};

export const useCreateNeighborhoodMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data => neighborhoodsService.createNeighborhood(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.NEIGHBORHOODS]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useUpdateNeighborhoodMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data =>
            neighborhoodsService.updateNeighborhood(data.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.NEIGHBORHOODS]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useDeleteNeighborhoodMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: id => neighborhoodsService.deleteNeighborhood(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.NEIGHBORHOODS]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};
