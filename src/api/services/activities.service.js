import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';

export const activitiesService = {
    getActivities: async params => {
        return await axiosInstance.get(API_URLS.ACTIVITIES.LIST, { params });
    },

    getActivity: async id => {
        return await axiosInstance.get(API_URLS.ACTIVITIES.DETAILS(id));
    },

    createActivity: async data => {
        return await axiosInstance.post(API_URLS.ACTIVITIES.CREATE, data);
    },

    updateActivity: async (id, data) => {
        return await axiosInstance.put(API_URLS.ACTIVITIES.UPDATE(id), data);
    },

    deleteActivity: async id => {
        return await axiosInstance.delete(API_URLS.ACTIVITIES.DELETE(id));
    }
};
