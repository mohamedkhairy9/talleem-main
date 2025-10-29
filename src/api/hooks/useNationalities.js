import { useQueryClient } from '@tanstack/react-query';
import { nationalitiesService } from '../services/nationalities.service';
import { API_KEYS } from '../endpoints';
import useCustomQuery from '../../utils/hooks/global/useCustomQuery';
import useCustomMutation from '../../utils/hooks/global/useCustomMutation';

export const useNationalitiesQuery = (params = {}, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.NATIONALITIES, params],
        queryFn: () => nationalitiesService.getNationalities(params),
        ...options
    });
};

export const useNationalityQuery = (id, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.NATIONALITIES, id],
        queryFn: () => nationalitiesService.getNationality(id),
        ...options
    });
};

export const useCreateNationalityMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data => nationalitiesService.createNationality(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.NATIONALITIES]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useUpdateNationalityMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data =>
            nationalitiesService.updateNationality(data.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.NATIONALITIES]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useDeleteNationalityMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: id => nationalitiesService.deleteNationality(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.NATIONALITIES]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};
