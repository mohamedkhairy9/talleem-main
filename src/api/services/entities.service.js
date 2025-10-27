import { multipartFormData } from '@/utils/constants/global.constants';
import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';

export const entitiesService = {
    getEntities: async params => {
        return await axiosInstance.get(API_URLS.ENTITIES.LIST, { params });
    },

    getEntity: async id => {
        return await axiosInstance.get(API_URLS.ENTITIES.DETAILS(id));
    },

    createEntity: async data => {
        return await axiosInstance.post(API_URLS.ENTITIES.CREATE, data, multipartFormData);
    },

    updateEntity: async (id, data) => {
        return await axiosInstance.post(API_URLS.ENTITIES.UPDATE(id), data, multipartFormData);
    },

    deleteEntity: async id => {
        return await axiosInstance.delete(API_URLS.ENTITIES.DELETE(id));
    }
};
