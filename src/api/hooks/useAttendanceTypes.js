import { useQueryClient } from '@tanstack/react-query';
import { attendanceTypesService } from '../services/attendanceTypes.service';
import { API_KEYS } from '../endpoints';
import useCustomQuery from '../../utils/hooks/global/useCustomQuery';
import useCustomMutation from '../../utils/hooks/global/useCustomMutation';

export const useAttendanceTypesQuery = params => {
    return useCustomQuery({
        queryKey: [API_KEYS.ATTENDANCES_TYPES, params],
        queryFn: () => attendanceTypesService.getAttendanceTypes(params)
    });
};

export const useAttendanceTypeQuery = id => {
    return useCustomQuery({
        queryKey: [API_KEYS.ATTENDANCES_TYPES, id],
        queryFn: () => attendanceTypesService.getAttendanceType(id)
    });
};

export const useCreateAttendanceTypeMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data => attendanceTypesService.createAttendanceType(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.ATTENDANCES_TYPES]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useUpdateAttendanceTypeMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data =>
            attendanceTypesService.updateAttendanceType(data.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.ATTENDANCES_TYPES]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useDeleteAttendanceTypeMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: id => attendanceTypesService.deleteAttendanceType(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.ATTENDANCES_TYPES]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};
