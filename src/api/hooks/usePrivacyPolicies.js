import { useQueryClient } from '@tanstack/react-query';
import { privacyPoliciesService } from '../services/privacyPolicies.service';
import { API_KEYS } from '../endpoints';
import useCustomQuery from '../../utils/hooks/global/useCustomQuery';
import useCustomMutation from '../../utils/hooks/global/useCustomMutation';

export const usePrivacyPoliciesQuery = () => {
    return useCustomQuery({
        queryKey: [API_KEYS.PRIVACY_POLICIES],
        queryFn: () => privacyPoliciesService.getPrivacyPolicies()
    });
};

export const useUpdatePrivacyPoliciesMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data => privacyPoliciesService.updatePrivacyPolicies(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.PRIVACY_POLICIES]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useDeletePrivacyPoliciesMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: () => privacyPoliciesService.deletePrivacyPolicies(),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.PRIVACY_POLICIES]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};
