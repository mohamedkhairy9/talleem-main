import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';

export const activityLogsService = {
    getActivityLogs: async params => {
        return await axiosInstance.get(API_URLS.ACTIVITY_LOGS.LIST, { params });
    }
};
