import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';

export const requestTypesService = {
    getRequestTypes: async params => {
        return await axiosInstance.get(API_URLS.REQUEST_TYPES.LIST, { params });
    },

    getRequestType: async id => {
        return await axiosInstance.get(API_URLS.REQUEST_TYPES.DETAILS(id));
    },

    createRequestType: async data => {
        return await axiosInstance.post(API_URLS.REQUEST_TYPES.CREATE, data);
    },

    updateRequestType: async (id, data) => {
        return await axiosInstance.put(API_URLS.REQUEST_TYPES.UPDATE(id), data);
    },

    deleteRequestType: async id => {
        return await axiosInstance.delete(API_URLS.REQUEST_TYPES.DELETE(id));
    }
};

