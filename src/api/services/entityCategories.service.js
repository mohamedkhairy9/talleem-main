import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';

export const entityCategoriesService = {
    getEntityCategories: async params => {
        return await axiosInstance.get(API_URLS.ENTITY_CATEGORIES.LIST, {
            params
        });
    },

    getEntityCategory: async id => {
        return await axiosInstance.get(API_URLS.ENTITY_CATEGORIES.DETAILS(id));
    },

    createEntityCategory: async data => {
        return await axiosInstance.post(
            API_URLS.ENTITY_CATEGORIES.CREATE,
            data
        );
    },

    updateEntityCategory: async (id, data) => {
        return await axiosInstance.put(
            API_URLS.ENTITY_CATEGORIES.UPDATE(id),
            data
        );
    },

    deleteEntityCategory: async id => {
        return await axiosInstance.delete(
            API_URLS.ENTITY_CATEGORIES.DELETE(id)
        );
    }
};
