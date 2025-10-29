import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';

export const entityActivitiesService = {
    getEntityActivities: async params => {
        return await axiosInstance.get(API_URLS.ENTITY_ACTIVITIES.LIST, {
            params
        });
    },

    getEntityActivity: async id => {
        return await axiosInstance.get(API_URLS.ENTITY_ACTIVITIES.DETAILS(id));
    },

    createEntityActivity: async data => {
        return await axiosInstance.post(
            API_URLS.ENTITY_ACTIVITIES.CREATE,
            data
        );
    },

    updateEntityActivity: async (id, data) => {
        return await axiosInstance.put(
            API_URLS.ENTITY_ACTIVITIES.UPDATE(id),
            data
        );
    },

    deleteEntityActivity: async id => {
        return await axiosInstance.delete(
            API_URLS.ENTITY_ACTIVITIES.DELETE(id)
        );
    }
};
