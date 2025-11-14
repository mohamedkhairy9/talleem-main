import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';

export const warningReasonsService = {
    getWarningReasons: async params => {
        return await axiosInstance.get(API_URLS.WARNING_REASONS.LIST, {
            params
        });
    },

    getWarningReason: async id => {
        return await axiosInstance.get(API_URLS.WARNING_REASONS.DETAILS(id));
    },

    createWarningReason: async data => {
        return await axiosInstance.post(API_URLS.WARNING_REASONS.CREATE, data);
    },

    updateWarningReason: async (id, data) => {
        return await axiosInstance.put(
            API_URLS.WARNING_REASONS.UPDATE(id),
            data
        );
    },

    deleteWarningReason: async id => {
        return await axiosInstance.delete(API_URLS.WARNING_REASONS.DELETE(id));
    }
};