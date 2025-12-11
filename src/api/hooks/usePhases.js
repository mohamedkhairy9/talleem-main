import { useQueryClient } from '@tanstack/react-query';
import { phasesService } from '../services/phases.service';
import { API_KEYS } from '../endpoints';
import useCustomQuery from '../../utils/hooks/global/useCustomQuery';
import useCustomMutation from '../../utils/hooks/global/useCustomMutation';

export const usePhasesQuery = (params = {}, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.PHASES, params],
        queryFn: () => phasesService.getPhases(params),
        ...options
    });
};

export const usePhaseQuery = (id, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.PHASES, id],
        queryFn: () => phasesService.getPhase(id),
        ...options
    });
};

export const useCreatePhaseMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data => phasesService.createPhase(data),
        mutationKey: 'create-phase',
        queryKeys: [API_KEYS.PHASES],
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.PHASES]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useUpdatePhaseMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data =>
            phasesService.updatePhase(data.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.PHASES]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useDeletePhaseMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: id => phasesService.deletePhase(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.PHASES]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useReorderStepsMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: ({ phaseId, data }) => phasesService.reorderSteps(phaseId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.PHASES]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

