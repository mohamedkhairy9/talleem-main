import { useQueryClient } from '@tanstack/react-query';
import { evaluationsService } from '../services/evaluations.service';
import { API_KEYS } from '../endpoints';
import useCustomQuery from '../../utils/hooks/global/useCustomQuery';
import useCustomMutation from '../../utils/hooks/global/useCustomMutation';

export const useEvaluationsQuery = (params = {}, options = {}) =>
    useCustomQuery({
        queryKey: [API_KEYS.EVALUATIONS, params],
        queryFn: () => evaluationsService.getEvaluations(params),
        ...options
    });

export const useReceivedEvaluationsQuery = (params = {}, options = {}) =>
    useCustomQuery({
        queryKey: [API_KEYS.EVALUATIONS, 'received', params],
        queryFn: () => evaluationsService.getReceivedEvaluations(params),
        ...options
    });

export const useAvailableEvaluationParametersQuery = (params = {}, options = {}) =>
    useCustomQuery({
        queryKey: [API_KEYS.EVALUATIONS, 'available-parameters', params],
        queryFn: () => evaluationsService.getAvailableParameters(params),
        ...options
    });

export const useEvaluationTemplatesQuery = (params = {}, options = {}) =>
    useCustomQuery({
        queryKey: [API_KEYS.EVALUATIONS, 'templates', params],
        queryFn: () => evaluationsService.getEvaluationTemplates(params),
        ...options
    });

export const useEvaluationTemplateQuery = (id, options = {}) =>
    useCustomQuery({
        queryKey: [API_KEYS.EVALUATIONS, 'template', id],
        queryFn: () => evaluationsService.getEvaluationTemplate(id),
        enabled: Boolean(id),
        ...options
    });

export const useEvaluationQuery = (id, options = {}) =>
    useCustomQuery({
        queryKey: [API_KEYS.EVALUATIONS, 'details', id],
        queryFn: () => evaluationsService.getEvaluation(id),
        enabled: Boolean(id),
        ...options
    });

export const useCreateEvaluationMutation = () => {
    const queryClient = useQueryClient();

    return useCustomMutation({
        mutationFn: evaluationsService.createEvaluation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [API_KEYS.EVALUATIONS] });
        }
    });
};
