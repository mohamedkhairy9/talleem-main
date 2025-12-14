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
    return useCustomMutation({
        mutationFn: data => stepsService.createStep(data),
        mutationKey: 'create-step',
        queryKeys: [API_KEYS.PHASES, API_KEYS.STEPS]
        // Query invalidation is handled automatically by useCustomMutation via queryKeys
    });
};

export const useUpdateStepMutation = () => {
    return useCustomMutation({
        mutationFn: data => stepsService.updateStep(data.id, data),
        queryKeys: [API_KEYS.PHASES, API_KEYS.STEPS]
        // Query invalidation is handled automatically by useCustomMutation via queryKeys
    });
};

export const useDeleteStepMutation = () => {
    return useCustomMutation({
        mutationFn: id => stepsService.deleteStep(id),
        queryKeys: [API_KEYS.PHASES, API_KEYS.STEPS]
        // Query invalidation is handled automatically by useCustomMutation via queryKeys
    });
};

