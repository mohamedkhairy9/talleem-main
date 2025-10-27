import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';

export const notificationTemplatesService = {
    getNotificationTemplates: async params => {
        return await axiosInstance.get(API_URLS.NOTIFICATION_TEMPLATES.LIST, {
            params
        });
    }
};
