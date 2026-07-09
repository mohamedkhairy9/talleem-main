import { multipartFormData } from '@/utils/constants/global.constants';
import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';
import { normalizeEntityListParams } from './entityListParams';

export const entitiesService = {
    getEntities: async params => {
        return await axiosInstance.get(API_URLS.ENTITIES.LIST, {
            params: normalizeEntityListParams(params)
        });
    },

    getEntity: async id => {
        return await axiosInstance.get(API_URLS.ENTITIES.DETAILS(id));
    },

    getUnlicensedEntities: async params => {
        return await axiosInstance.get(API_URLS.LICENSES.UNLICENSED_ENTITIES, {
            params
        });
    },

    createEntity: async data => {
        return await axiosInstance.post(
            API_URLS.ENTITIES.CREATE,
            data,
            multipartFormData
        );
    },

    updateEntity: async (id, data) => {
        return await axiosInstance.post(
            API_URLS.ENTITIES.UPDATE(id),
            data,
            multipartFormData
        );
    },

    deleteEntity: async id => {
        return await axiosInstance.delete(API_URLS.ENTITIES.DELETE(id));
    },

    getPendingEntityLicenses: async params => {
        return await axiosInstance.get(API_URLS.ENTITY_LICENSES.PENDING, {
            params
        });
    },

    issueEntityLicense: async (entityId, data) => {
        return await axiosInstance.post(
            API_URLS.LICENSES.ISSUE_ENTITY(entityId),
            data
        );
    },

    renewEntityLicense: async (entityId, data) => {
        return await axiosInstance.post(
            API_URLS.ENTITY_LICENSES.RENEW(entityId),
            data
        );
    },

    updateEntityLicenseActivities: async (entityId, data) => {
        return await axiosInstance.post(
            API_URLS.ENTITY_LICENSES.UPDATE_ACTIVITIES(entityId),
            data
        );
    },

    importEntities: async data => {
        return await axiosInstance.post(
            API_URLS.ENTITIES.IMPORT,
            data,
            multipartFormData
        );
    },

    exportExampleFile: async () => {
        return await axiosInstance.get(API_URLS.ENTITIES.EXPORT_EXAMPLE, {
            responseType: 'blob'
        });
    }
};
