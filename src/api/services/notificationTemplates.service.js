import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';

export const notificationTemplatesService = {
    getNotificationTemplates: async params => {
        return await axiosInstance.get(API_URLS.NOTIFICATION_TEMPLATES.LIST, {
            params
        });
    },

    getNotificationTemplate: async id => {
        return await axiosInstance.get(
            API_URLS.NOTIFICATION_TEMPLATES.DETAILS(id)
        );
    },

    updateNotificationTemplate: async (id, data) => {
        return await axiosInstance.put(
            API_URLS.NOTIFICATION_TEMPLATES.UPDATE(id),
            data
        );
    }
};
