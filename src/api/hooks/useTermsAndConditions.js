import { useQueryClient } from '@tanstack/react-query';
import { termsAndConditionsService } from '../services/termsAndConditions.service';
import { API_KEYS } from '../endpoints';
import useCustomQuery from '../../utils/hooks/global/useCustomQuery';
import useCustomMutation from '../../utils/hooks/global/useCustomMutation';

export const useTermsAndConditionsQuery = (options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.TERMS_AND_CONDITIONS],
        queryFn: () => termsAndConditionsService.getTermsAndConditions(),
        ...options
    });
};

export const useUpdateTermsAndConditionsMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data =>
            termsAndConditionsService.updateTermsAndConditions(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.TERMS_AND_CONDITIONS]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useDeleteTermsAndConditionsMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: () => termsAndConditionsService.deleteTermsAndConditions(),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.TERMS_AND_CONDITIONS]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};
