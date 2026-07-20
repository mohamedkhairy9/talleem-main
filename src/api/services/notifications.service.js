import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';

export const notificationsService = {
    getNotifications: async ({ page = 1, per_page = 10, ...filters } = {}) => {
        return await axiosInstance.get(API_URLS.NOTIFICATIONS.LIST, {
            params: {
                ...filters,
                page,
                per_page
            }
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
