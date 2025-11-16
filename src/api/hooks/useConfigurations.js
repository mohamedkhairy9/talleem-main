import { useQueryClient } from '@tanstack/react-query';
import { configurationsService } from '../services/configurations.service';
import { API_KEYS } from '../endpoints';
import useCustomQuery from '../../utils/hooks/global/useCustomQuery';
import useCustomMutation from '../../utils/hooks/global/useCustomMutation';

export const useConfigurationsQuery = (program = 'all', options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.CONFIGURATIONS, program],
        queryFn: () => configurationsService.getConfigurations(program),
        ...options
    });
};

export const useConfigurationQuery = (program, key, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.CONFIGURATIONS, program, key],
        queryFn: () => configurationsService.getConfiguration(program, key),
        enabled: !!program && !!key,
        ...options
    });
};

export const useUpdateConfigurationMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: ({ program, data }) =>
            configurationsService.updateConfiguration(program, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.CONFIGURATIONS]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};