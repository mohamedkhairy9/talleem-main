import { useQueryClient } from '@tanstack/react-query';
import { joinRequestsService } from '../services/joinRequests.service';
import { API_KEYS } from '../endpoints';
import useCustomQuery from '../../utils/hooks/global/useCustomQuery';
import useCustomMutation from '../../utils/hooks/global/useCustomMutation';

export const useJoinRequestsQuery = (params = {}, options = {}, requestOptions = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.JOIN_REQUESTS, params, requestOptions.mode || 'auto'],
        queryFn: () => joinRequestsService.getJoinRequests(params, requestOptions),
        ...options
    });
};

export const useAllJoinRequestsQuery = (params = {}, options = {}, requestOptions = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.JOIN_REQUESTS, 'all-pages', params, requestOptions.mode || 'auto'],
        queryFn: () => joinRequestsService.getAllJoinRequests(params, requestOptions),
        ...options
    });
};

export const useJoinRequestDetailsQuery = (id, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.JOIN_REQUESTS, 'details', id],
        queryFn: () => joinRequestsService.getJoinRequestDetails(id),
        enabled: Boolean(id) && options.enabled !== false,
        ...options
    });
};

export const useJoinRequestLogsQuery = (id, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.JOIN_REQUESTS, 'logs', id],
        queryFn: () => joinRequestsService.getJoinRequestLogs(id),
        enabled: Boolean(id) && options.enabled !== false,
        ...options
    });
};

export const useProcessJoinRequestStepMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: ({ id, data }) => joinRequestsService.processStep(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.JOIN_REQUESTS]
            });

            // A final approval for a teacher join request creates its Teacher
            // profile and User account on the workflow API. These lists can
            // otherwise remain fresh in React Query for up to five minutes.
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.TEACHERS]
            });
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.USERS]
            });
        }
    });
};

