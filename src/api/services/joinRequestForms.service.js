import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';

export const joinRequestFormsService = {
    getJoinRequestForms: async params => {
        return await axiosInstance.get(API_URLS.JOIN_REQUEST_FORMS.LIST, { params });
    },

    getJoinRequestForm: async id => {
        return await axiosInstance.get(API_URLS.JOIN_REQUEST_FORMS.DETAILS(id));
    },

    createJoinRequestForm: async data => {
        return await axiosInstance.post(API_URLS.JOIN_REQUEST_FORMS.CREATE, data);
    },

    updateJoinRequestForm: async (id, data) => {
        return await axiosInstance.put(API_URLS.JOIN_REQUEST_FORMS.UPDATE(id), data);
    },

    deleteJoinRequestForm: async id => {
        return await axiosInstance.delete(API_URLS.JOIN_REQUEST_FORMS.DELETE(id));
    },

    reorderFields: async (id, payload) => {
        return await axiosInstance.post(API_URLS.JOIN_REQUEST_FORMS.REORDER_FIELDS(id), payload);
    }
};

