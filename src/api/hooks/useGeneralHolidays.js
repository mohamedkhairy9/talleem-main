import { useQueryClient } from '@tanstack/react-query';
import { generalHolidaysService } from '../services/generalHolidays.service';
import { API_KEYS } from '../endpoints';
import useCustomQuery from '../../utils/hooks/global/useCustomQuery';
import useCustomMutation from '../../utils/hooks/global/useCustomMutation';

export const useGeneralHolidaysQuery = (params = {}, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.GENERAL_HOLIDAYS, params],
        queryFn: () => generalHolidaysService.getGeneralHolidays(params),
        ...options
    });
};

export const useGeneralHolidayQuery = (id, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.GENERAL_HOLIDAYS, id],
        queryFn: () => generalHolidaysService.getGeneralHoliday(id),
        ...options
    });
};

export const useCreateGeneralHolidayMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data => generalHolidaysService.createGeneralHoliday(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.GENERAL_HOLIDAYS]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useUpdateGeneralHolidayMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data =>
            generalHolidaysService.updateGeneralHoliday(data.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.GENERAL_HOLIDAYS]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useDeleteGeneralHolidayMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: id => generalHolidaysService.deleteGeneralHoliday(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.GENERAL_HOLIDAYS]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};
