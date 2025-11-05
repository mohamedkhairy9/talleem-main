import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';

export const majorsService = {
    getMajors: async params => {
        return await axiosInstance.get(API_URLS.MAJORS.LIST, { params });
    },

    getMajor: async id => {
        return await axiosInstance.get(API_URLS.MAJORS.DETAILS(id));
    },

    createMajor: async data => {
        return await axiosInstance.post(API_URLS.MAJORS.CREATE, data);
    },

    deleteMajor: async id => {
        return await axiosInstance.delete(API_URLS.MAJORS.DELETE(id));
    },

    updateMajor: async (id, data) => {
        return await axiosInstance.put(API_URLS.MAJORS.UPDATE(id), data);
    }
}