import { useQueryClient } from '@tanstack/react-query';
import { requestTypesService } from '../services/requestTypes.service';
import { API_KEYS } from '../endpoints';
import useCustomQuery from '../../utils/hooks/global/useCustomQuery';
import useCustomMutation from '../../utils/hooks/global/useCustomMutation';

export const useRequestTypesQuery = (params = {}, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.REQUEST_TYPES, params],
        queryFn: () => requestTypesService.getRequestTypes(params),
        ...options
    });
};

export const useRequestTypeQuery = (id, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.REQUEST_TYPES, id],
        queryFn: () => requestTypesService.getRequestType(id),
        ...options
    });
};

export const useCreateRequestTypeMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data => requestTypesService.createRequestType(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.REQUEST_TYPES]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useUpdateRequestTypeMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data =>
            requestTypesService.updateRequestType(data.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.REQUEST_TYPES]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useDeleteRequestTypeMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: id => requestTypesService.deleteRequestType(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.REQUEST_TYPES]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

