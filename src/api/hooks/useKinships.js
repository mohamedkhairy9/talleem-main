import { useQueryClient } from '@tanstack/react-query';
import { kinshipsService } from '../services/kinships.service';
import { API_KEYS } from '../endpoints';
import useCustomQuery from '../../utils/hooks/global/useCustomQuery';
import useCustomMutation from '../../utils/hooks/global/useCustomMutation';

export const useKinshipsQuery = params => {
    return useCustomQuery({
        queryKey: [API_KEYS.KINSHIPS, params],
        queryFn: () => kinshipsService.getKinships(params)
    });
};

export const useKinshipQuery = id => {
    return useCustomQuery({
        queryKey: [API_KEYS.KINSHIPS, id],
        queryFn: () => kinshipsService.getKinship(id)
    });
};

export const useCreateKinshipMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data => kinshipsService.createKinship(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [API_KEYS.KINSHIPS] });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useUpdateKinshipMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data => kinshipsService.updateKinship(data.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [API_KEYS.KINSHIPS] });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useDeleteKinshipMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: id => kinshipsService.deleteKinship(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [API_KEYS.KINSHIPS] });
        },
        onError: error => {
            console.log(error);
        }
    });
};
