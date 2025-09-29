import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';

export const sessionPeriodsService = {
    getSessionPeriods: async params => {
        return await axiosInstance.get(API_URLS.SESSION_PERIODS.LIST, {
            params
        });
    },

    getSessionPeriod: async id => {
        return await axiosInstance.get(API_URLS.SESSION_PERIODS.DETAILS(id));
    },

    createSessionPeriod: async data => {
        return await axiosInstance.post(API_URLS.SESSION_PERIODS.CREATE, data);
    },

    updateSessionPeriod: async (id, data) => {
        return await axiosInstance.put(
            API_URLS.SESSION_PERIODS.UPDATE(id),
            data
        );
    },

    deleteSessionPeriod: async id => {
        return await axiosInstance.delete(API_URLS.SESSION_PERIODS.DELETE(id));
    }
};
