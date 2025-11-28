import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';

export const notificationsService = {
    getNotifications: async params => {
        return await axiosInstance.get(API_URLS.NOTIFICATIONS.LIST, {
            params
        });
    },

    triggerNotification: async data => {
        return await axiosInstance.post(
            API_URLS.NOTIFICATION_TRIGGER.TRIGGER,
            data
        );
    },

    scheduleNotification: async data => {
        return await axiosInstance.post(
            API_URLS.NOTIFICATION_SCHEDULE.SCHEDULE,
            data
        );
    }
};
