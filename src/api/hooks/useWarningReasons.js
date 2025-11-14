import { useQueryClient } from '@tanstack/react-query';
import { warningReasonsService } from '../services/warningReasons.service';
import { API_KEYS } from '../endpoints';
import useCustomQuery from '../../utils/hooks/global/useCustomQuery';
import useCustomMutation from '../../utils/hooks/global/useCustomMutation';

export const useWarningReasonsQuery = (params = {}, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.WARNING_REASONS, params],
        queryFn: () => warningReasonsService.getWarningReasons(params),
        ...options
    });
};

export const useWarningReasonQuery = (id, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.WARNING_REASONS, id],
        queryFn: () => warningReasonsService.getWarningReason(id),
        ...options
    });
};

export const useCreateWarningReasonMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data => warningReasonsService.createWarningReason(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.WARNING_REASONS]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useUpdateWarningReasonMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data =>
            warningReasonsService.updateWarningReason(data.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.WARNING_REASONS]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useDeleteWarningReasonMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: id => warningReasonsService.deleteWarningReason(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.WARNING_REASONS]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};