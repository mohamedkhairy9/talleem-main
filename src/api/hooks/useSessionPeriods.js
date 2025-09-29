import { useQueryClient } from '@tanstack/react-query';
import { sessionPeriodsService } from '../services/sessionPeriods.service';
import { API_KEYS } from '../endpoints';
import useCustomQuery from '../../utils/hooks/global/useCustomQuery';
import useCustomMutation from '../../utils/hooks/global/useCustomMutation';

export const useSessionPeriodsQuery = params => {
    return useCustomQuery({
        queryKey: [API_KEYS.SESSION_PERIODS, params],
        queryFn: () => sessionPeriodsService.getSessionPeriods(params)
    });
};

export const useSessionPeriodQuery = id => {
    return useCustomQuery({
        queryKey: [API_KEYS.SESSION_PERIODS, id],
        queryFn: () => sessionPeriodsService.getSessionPeriod(id)
    });
};

export const useCreateSessionPeriodMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data => sessionPeriodsService.createSessionPeriod(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.SESSION_PERIODS]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useUpdateSessionPeriodMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data =>
            sessionPeriodsService.updateSessionPeriod(data.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.SESSION_PERIODS]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useDeleteSessionPeriodMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: id => sessionPeriodsService.deleteSessionPeriod(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.SESSION_PERIODS]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};
