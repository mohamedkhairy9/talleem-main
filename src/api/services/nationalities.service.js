import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';

export const nationalitiesService = {
    getNationalities: async params => {
        return await axiosInstance.get(API_URLS.NATIONALITIES.LIST, { params });
    },

    getNationality: async id => {
        return await axiosInstance.get(API_URLS.NATIONALITIES.DETAILS(id));
    },

    createNationality: async data => {
        return await axiosInstance.post(API_URLS.NATIONALITIES.CREATE, data);
    },

    updateNationality: async (id, data) => {
        return await axiosInstance.put(API_URLS.NATIONALITIES.UPDATE(id), data);
    },

    deleteNationality: async id => {
        return await axiosInstance.delete(API_URLS.NATIONALITIES.DELETE(id));
    }
};
