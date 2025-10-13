import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';

export const aboutUsService = {
    getAboutUs: async () => {
        return await axiosInstance.get(API_URLS.ABOUT_US.GET);
    },

    updateAboutUs: async data => {
        return await axiosInstance.post(API_URLS.ABOUT_US.UPDATE, data);
    },

    deleteAboutUs: async () => {
        return await axiosInstance.delete(API_URLS.ABOUT_US.DELETE);
    }
};
