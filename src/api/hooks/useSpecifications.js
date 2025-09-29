import { useQueryClient } from '@tanstack/react-query';
import { specificationsService } from '../services/specifications.service';
import { API_KEYS } from '../endpoints';
import useCustomQuery from '../../utils/hooks/global/useCustomQuery';
import useCustomMutation from '../../utils/hooks/global/useCustomMutation';

export const useSpecificationsQuery = params => {
    return useCustomQuery({
        queryKey: [API_KEYS.SPECIFICATIONS, params],
        queryFn: () => specificationsService.getSpecifications(params)
    });
};

export const useSpecificationQuery = id => {
    return useCustomQuery({
        queryKey: [API_KEYS.SPECIFICATIONS, id],
        queryFn: () => specificationsService.getSpecification(id)
    });
};

export const useCreateSpecificationMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data => specificationsService.createSpecification(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.SPECIFICATIONS]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useUpdateSpecificationMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data =>
            specificationsService.updateSpecification(data.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.SPECIFICATIONS]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useDeleteSpecificationMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: id => specificationsService.deleteSpecification(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.SPECIFICATIONS]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};
