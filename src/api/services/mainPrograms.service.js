import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';

export const mainProgramsService = {
    getMainPrograms: async params => {
        return await axiosInstance.get(API_URLS.MAIN_PROGRAMS.LIST, { params });
    },

    getMainProgram: async id => {
        return await axiosInstance.get(API_URLS.MAIN_PROGRAMS.DETAILS(id));
    },

    createMainProgram: async data => {
        return await axiosInstance.post(API_URLS.MAIN_PROGRAMS.CREATE, data);
    },

    updateMainProgram: async (id, data) => {
        return await axiosInstance.put(API_URLS.MAIN_PROGRAMS.UPDATE(id), data);
    },

    deleteMainProgram: async id => {
        return await axiosInstance.delete(API_URLS.MAIN_PROGRAMS.DELETE(id));
    }
};
