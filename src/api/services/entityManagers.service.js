import { multipartFormData } from '@/utils/constants/global.constants';
import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';

export const entityManagersService = {
    getEntityManagers: async params => {
        return await axiosInstance.get(API_URLS.ENTITY_MANAGERS.LIST, {
            params
        });
    },

    getEntityManager: async id => {
        return await axiosInstance.get(API_URLS.ENTITY_MANAGERS.DETAILS(id));
    },

    createEntityManager: async data => {
        return await axiosInstance.post(API_URLS.ENTITY_MANAGERS.CREATE, data, multipartFormData);
    },

    updateEntityManager: async (id, data) => {
        return await axiosInstance.post(
            API_URLS.ENTITY_MANAGERS.UPDATE(id),
            data,
            multipartFormData
        );
    },

    importEntityMangers: async data => {
        return await axiosInstance.post(
            API_URLS.ENTITY_MANAGERS.IMPORT,
            data,
            multipartFormData
        );
    },

    exportExampleFile: async () => {
        return await axiosInstance.get(API_URLS.ENTITY_MANAGERS.EXPORT_EXAMPLE, {
            responseType: 'blob'
        });
    },

    deleteEntityManager: async id => {
        return await axiosInstance.delete(API_URLS.ENTITY_MANAGERS.DELETE(id));
    }
};
