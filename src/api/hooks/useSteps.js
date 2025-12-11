import { useQueryClient } from '@tanstack/react-query';
import { stepsService } from '../services/steps.service';
import { API_KEYS } from '../endpoints';
import useCustomQuery from '../../utils/hooks/global/useCustomQuery';
import useCustomMutation from '../../utils/hooks/global/useCustomMutation';

export const useStepQuery = (id, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.STEPS, id],
        queryFn: () => stepsService.getStep(id),
        enabled: !!id,
        ...options
    });
};

export const useCreateStepMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data => stepsService.createStep(data),
        mutationKey: 'create-step',
        queryKeys: [API_KEYS.PHASES, API_KEYS.STEPS],
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.PHASES]
            });
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.STEPS]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useUpdateStepMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data => stepsService.updateStep(data.id, data),
        queryKeys: [API_KEYS.PHASES, API_KEYS.STEPS],
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.PHASES]
            });
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.STEPS]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useDeleteStepMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: id => stepsService.deleteStep(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.PHASES]
            });
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.STEPS]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

