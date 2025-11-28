import { useQueryClient } from '@tanstack/react-query';
import { notificationsService } from '../services/notifications.service';
import { API_KEYS } from '../endpoints';
import useCustomQuery from '../../utils/hooks/global/useCustomQuery';
import useCustomMutation from '../../utils/hooks/global/useCustomMutation';

export const useNotificationsQuery = (params = {}, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.NOTIFICATIONS, params],
        queryFn: () => notificationsService.getNotifications(params),
        ...options
    });
};

export const useTriggerNotificationMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data => notificationsService.triggerNotification(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.NOTIFICATIONS]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useScheduleNotificationMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data => notificationsService.scheduleNotification(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.NOTIFICATIONS]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};
