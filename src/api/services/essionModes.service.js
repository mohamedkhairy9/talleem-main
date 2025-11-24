import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';

export const sessionModesService = {
    getSessionModes: async params => {
        return await axiosInstance.get(API_URLS.SESSION_MODES.LIST, {
            params
        });
    },

    getSessionMode: async id => {
        return await axiosInstance.get(API_URLS.SESSION_MODES.DETAILS(id));
    },

    createSessionMode: async data => {
        return await axiosInstance.post(API_URLS.SESSION_MODES.CREATE, data);
    },

    updateSessionMode: async (id, data) => {
        return await axiosInstance.put(API_URLS.SESSION_MODES.UPDATE(id), data);
    },

    deleteSessionMode: async id => {
        return await axiosInstance.delete(API_URLS.SESSION_MODES.DELETE(id));
    }
};