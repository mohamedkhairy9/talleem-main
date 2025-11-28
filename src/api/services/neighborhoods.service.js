import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';

export const neighborhoodsService = {
    getNeighborhoods: async params => {
        return await axiosInstance.get(API_URLS.NEIGHBORHOODS.LIST, { params });
    },

    getNeighborhood: async id => {
        return await axiosInstance.get(API_URLS.NEIGHBORHOODS.DETAILS(id));
    },

    createNeighborhood: async data => {
        return await axiosInstance.post(API_URLS.NEIGHBORHOODS.CREATE, data);
    },

    updateNeighborhood: async (id, data) => {
        return await axiosInstance.put(API_URLS.NEIGHBORHOODS.UPDATE(id), data);
    },

    deleteNeighborhood: async id => {
        return await axiosInstance.delete(API_URLS.NEIGHBORHOODS.DELETE(id));
    }
};
