import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';

export const citiesService = {
    
    getCities: async params => {
        return await axiosInstance.get(API_URLS.CITIES.LIST, { params });
    },

    getCity: async id => {
        return await axiosInstance.get(API_URLS.CITIES.DETAILS(id));
    },

    createCity: async data => {
        return await axiosInstance.post(API_URLS.CITIES.CREATE, data);
    },

    updateCity: async (id, data) => {
        return await axiosInstance.put(API_URLS.CITIES.UPDATE(id), data);
    },

    deleteCity: async id => {
        return await axiosInstance.delete(API_URLS.CITIES.DELETE(id));
    }
};