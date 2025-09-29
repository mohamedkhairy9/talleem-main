import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';

export const kinshipsService = {
    getKinships: async params => {
        return await axiosInstance.get(API_URLS.KINSHIPS.LIST, { params });
    },

    getKinship: async id => {
        return await axiosInstance.get(API_URLS.KINSHIPS.DETAILS(id));
    },

    createKinship: async data => {
        return await axiosInstance.post(API_URLS.KINSHIPS.CREATE, data);
    },

    updateKinship: async (id, data) => {
        return await axiosInstance.put(API_URLS.KINSHIPS.UPDATE(id), data);
    },

    deleteKinship: async id => {
        return await axiosInstance.delete(API_URLS.KINSHIPS.DELETE(id));
    }
};
