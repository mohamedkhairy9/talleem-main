import { useQueryClient } from '@tanstack/react-query';
import { locationTypesService } from '../services/locationTypes.service';
import { API_KEYS } from '../endpoints';
import useCustomQuery from '../../utils/hooks/global/useCustomQuery';
import useCustomMutation from '../../utils/hooks/global/useCustomMutation';

export const useLocationTypesQuery = (params = {}, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.LOCATION_TYPES, params],
        queryFn: () => locationTypesService.getLocationTypes(params),
        ...options
    });
};

export const useLocationTypeQuery = (id, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.LOCATION_TYPES, id],
        queryFn: () => locationTypesService.getLocationType(id),
        ...options
    });
};

export const useCreateLocationTypeMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data => locationTypesService.createLocationType(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.LOCATION_TYPES]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useUpdateLocationTypeMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data =>
            locationTypesService.updateLocationType(data.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.LOCATION_TYPES]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useDeleteLocationTypeMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: id => locationTypesService.deleteLocationType(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.LOCATION_TYPES]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};
