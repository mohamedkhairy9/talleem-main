import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';

export const countriesService = {
    getCountries: async params => {
        return await axiosInstance.get(API_URLS.COUNTRIES.LIST, { params });
    },

    getCountry: async id => {
        return await axiosInstance.get(API_URLS.COUNTRIES.DETAILS(id));
    },

    createCountry: async data => {
        return await axiosInstance.post(API_URLS.COUNTRIES.CREATE, data);
    },

    updateCountry: async (id, data) => {
        return await axiosInstance.put(API_URLS.COUNTRIES.UPDATE(id), data);
    },

    deleteCountry: async id => {
        return await axiosInstance.delete(API_URLS.COUNTRIES.DELETE(id));
    }
};
