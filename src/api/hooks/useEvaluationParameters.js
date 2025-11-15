import { useQueryClient } from '@tanstack/react-query';
import { evaluationParametersService } from '../services/evaluationParameters.service';
import { API_KEYS } from '../endpoints';
import useCustomQuery from '../../utils/hooks/global/useCustomQuery';
import useCustomMutation from '../../utils/hooks/global/useCustomMutation';

export const useEvaluationParametersQuery = (params = {}, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.EVALUATION_PARAMETERS, params],
        queryFn: () => evaluationParametersService.getEvaluationParameters(params),
        ...options
    });
};

export const useEvaluationParameterQuery = (id, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.EVALUATION_PARAMETERS, id],
        queryFn: () => evaluationParametersService.getEvaluationParameter(id),
        ...options
    });
};

export const useCreateEvaluationParameterMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data => evaluationParametersService.createEvaluationParameter(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.EVALUATION_PARAMETERS]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useUpdateEvaluationParameterMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data =>
            evaluationParametersService.updateEvaluationParameter(data.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.EVALUATION_PARAMETERS]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useDeleteEvaluationParameterMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: id => evaluationParametersService.deleteEvaluationParameter(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.EVALUATION_PARAMETERS]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};