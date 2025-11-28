import useCustomQuery from '@/utils/hooks/global/useCustomQuery';
import { useQueryClient } from '@tanstack/react-query';
import { API_KEYS } from '../endpoints';
import { sessionModesService } from '../services/essionModes.service';
import useCustomMutation from '@/utils/hooks/global/useCustomMutation';

export const useSessionModesQuery = (params = {}, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.SESSION_MODES, params],
        queryFn: () => sessionModesService.getSessionModes(params),
        ...options
    });
};

export const useSessionModeQuery = (id, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.SESSION_MODES, id],
        queryFn: () => sessionModesService.getSessionMode(id),
        ...options
    });
};

export const useCreateSessionModeMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data => sessionModesService.createSessionMode(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.SESSION_MODES]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useUpdateSessionModeMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data =>
            sessionModesService.updateSessionMode(data.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.SESSION_MODES]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useDeleteSessionModeMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: id => sessionModesService.deleteSessionMode(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.SESSION_MODES]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};