import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';

export const jobsService = {
    
    getJobs: async params => {
        return await axiosInstance.get(API_URLS.JOBS.LIST, { params });
    },

    getJob: async id => {
        return await axiosInstance.get(API_URLS.JOBS.DETAILS(id));
    },

    createJob: async data => {
        return await axiosInstance.post(API_URLS.JOBS.CREATE, data);
    },

    updateJob: async (id, data) => {
        return await axiosInstance.put(API_URLS.JOBS.UPDATE(id), data);
    },

    deleteJob: async id => {
        return await axiosInstance.delete(API_URLS.JOBS.DELETE(id));
    }
};