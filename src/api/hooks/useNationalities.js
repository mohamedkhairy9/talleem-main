import { useQueryClient } from '@tanstack/react-query';
import { nationalitiesService } from '../services/nationalities.service';
import { API_KEYS } from '../endpoints';
import useCustomQuery from '../../utils/hooks/global/useCustomQuery';
import useCustomMutation from '../../utils/hooks/global/useCustomMutation';

export const useNationalitiesQuery = params => {
    return useCustomQuery({
        queryKey: [API_KEYS.NATIONALITIES, params],
        queryFn: () => nationalitiesService.getNationalities(params)
    });
};

export const useNationalityQuery = id => {
    return useCustomQuery({
        queryKey: [API_KEYS.NATIONALITIES, id],
        queryFn: () => nationalitiesService.getNationality(id)
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
        mutationFn: ({ id, data }) =>
            nationalitiesService.updateNationality(id, data),
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
