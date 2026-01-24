import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';

export const nationalitiesService = {
    getNationalities: async params => {
        const response = await axiosInstance.get(API_URLS.NATIONALITIES.LIST, { params });
        // Handle case where API returns array with one object containing data and meta
        // The axios interceptor already extracts response.data, so response is the array
        if (Array.isArray(response) && response.length > 0 && response[0]?.data) {
            return response[0];
        }
        return response;
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
