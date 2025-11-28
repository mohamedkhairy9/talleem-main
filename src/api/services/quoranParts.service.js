import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';

export const quoranPartsService = {
    getQuoranParts: async params => {
        return await axiosInstance.get(API_URLS.QUORAN_PARTS.LIST, { params });
    },

    getQuoranPart: async id => {
        return await axiosInstance.get(API_URLS.QUORAN_PARTS.DETAILS(id));
    },

    createQuoranPart: async data => {
        return await axiosInstance.post(API_URLS.QUORAN_PARTS.CREATE, data);
    },

    updateQuoranPart: async (id, data) => {
        return await axiosInstance.put(API_URLS.QUORAN_PARTS.UPDATE(id), data);
    },

    deleteQuoranPart: async id => {
        return await axiosInstance.delete(API_URLS.QUORAN_PARTS.DELETE(id));
    }
};
