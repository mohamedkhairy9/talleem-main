import { useQueryClient } from '@tanstack/react-query';
import { API_KEYS } from '../endpoints';
import useCustomQuery from '../../utils/hooks/global/useCustomQuery';
import useCustomMutation from '../../utils/hooks/global/useCustomMutation';
import { remotelyAttendancePlatformsServices } from '../services/remotelyAttendancePlatforms';

export const useRemotelyAttendancePlatformsQuery = (params = {}, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.REMOTELY_ATTENDANCE_PLATFROMS, params],
        queryFn: () => remotelyAttendancePlatformsServices.getRemotelyAttendancePlatforms(params),
        ...options
    });
};

export const useRemotelyAttendancePlatformQuery = (id, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.REMOTELY_ATTENDANCE_PLATFROMS, id],
        queryFn: () => remotelyAttendancePlatformsServices.getRemotelyAttendancePlatform(id),
        ...options
    });
};

export const useCreateRemotelyAttendancePlatformMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data => remotelyAttendancePlatformsServices.createRemotelyAttendancePlatform(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.REMOTELY_ATTENDANCE_PLATFROMS]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useUpdateRemotelyAttendancePlatformMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data => remotelyAttendancePlatformsServices.updateRemotelyAttendancePlatform(data.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.REMOTELY_ATTENDANCE_PLATFROMS]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useDeleteRemotelyAttendancePlatformMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: id => remotelyAttendancePlatformsServices.deleteRemotelyAttendancePlatform(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.REMOTELY_ATTENDANCE_PLATFROMS]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};
