import { useQueryClient } from '@tanstack/react-query';
import { warningsService } from '../services/warnings.service';
import { API_KEYS } from '../endpoints';
import useCustomQuery from '../../utils/hooks/global/useCustomQuery';
import useCustomMutation from '../../utils/hooks/global/useCustomMutation';

export const useWarningsQuery = (params = {}, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.WARNINGS, params],
        queryFn: () => warningsService.getWarnings(params),
        ...options
    });
};

export const useWarningQuery = (id, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.WARNINGS, id],
        queryFn: () => warningsService.getWarning(id),
        ...options
    });
};

export const useCreateWarningMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data => warningsService.createWarning(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.WARNINGS]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useUpdateWarningMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data =>
            warningsService.updateWarning(data.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.WARNINGS]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useDeleteWarningMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: id => warningsService.deleteWarning(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.WARNINGS]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};
