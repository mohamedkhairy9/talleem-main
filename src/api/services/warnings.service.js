import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';

export const warningsService = {
    getWarnings: async params => {
        return await axiosInstance.get(API_URLS.WARNINGS.LIST, {
            params
        });
    },

    getWarning: async id => {
        return await axiosInstance.get(API_URLS.WARNINGS.DETAILS(id));
    },

    createWarning: async data => {
        return await axiosInstance.post(
            API_URLS.WARNINGS.CREATE,
            data
        );
    },

    updateWarning: async (id, data) => {
        return await axiosInstance.put(
            API_URLS.WARNINGS.UPDATE(id),
            data
        );
    },

    deleteWarning: async id => {
        return await axiosInstance.delete(
            API_URLS.WARNINGS.DELETE(id)
        );
    }
};
