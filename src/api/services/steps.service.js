import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';

export const stepsService = {
    getSteps: async params => {
        return await axiosInstance.get(API_URLS.STEPS.LIST, { params });
    },

    getStep: async id => {
        return await axiosInstance.get(API_URLS.STEPS.DETAILS(id));
    },

    createStep: async data => {
        return await axiosInstance.post(API_URLS.STEPS.CREATE, data);
    },

    updateStep: async (id, data) => {
        return await axiosInstance.put(API_URLS.STEPS.UPDATE(id), data);
    },

    deleteStep: async id => {
        return await axiosInstance.delete(API_URLS.STEPS.DELETE(id));
    }
};

