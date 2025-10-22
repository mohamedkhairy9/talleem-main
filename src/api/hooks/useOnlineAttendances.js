import { useQueryClient } from '@tanstack/react-query';
import { onlineAttendancesService } from '../services/onlineAttendances.service';
import { API_KEYS } from '../endpoints';
import useCustomQuery from '../../utils/hooks/global/useCustomQuery';
import useCustomMutation from '../../utils/hooks/global/useCustomMutation';

export const useOnlineAttendancesQuery = params => {
    return useCustomQuery({
        queryKey: [API_KEYS.ONLINE_ATTENDANCES, params],
        queryFn: () => onlineAttendancesService.getOnlineAttendances(params)
    });
};

export const useOnlineAttendanceQuery = id => {
    return useCustomQuery({
        queryKey: [API_KEYS.ONLINE_ATTENDANCES, id],
        queryFn: () => onlineAttendancesService.getOnlineAttendance(id)
    });
};

export const useCreateOnlineAttendanceMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data =>
            onlineAttendancesService.createOnlineAttendance(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.ONLINE_ATTENDANCES]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useUpdateOnlineAttendanceMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: (data) =>
            onlineAttendancesService.updateOnlineAttendance(data.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.ONLINE_ATTENDANCES]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useDeleteOnlineAttendanceMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: id => onlineAttendancesService.deleteOnlineAttendance(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.ONLINE_ATTENDANCES]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};
