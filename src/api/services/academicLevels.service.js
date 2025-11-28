import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';

export const academicLevelsService = {
    getAcademicLevels: async params => {
        return await axiosInstance.get(API_URLS.ACADEMIC_LEVELS.LIST, {
            params
        });
    },

    getAcademicLevel: async id => {
        return await axiosInstance.get(API_URLS.ACADEMIC_LEVELS.DETAILS(id));
    },

    createAcademicLevel: async data => {
        return await axiosInstance.post(API_URLS.ACADEMIC_LEVELS.CREATE, data);
    },

    updateAcademicLevel: async (id, data) => {
        return await axiosInstance.put(
            API_URLS.ACADEMIC_LEVELS.UPDATE(id),
            data
        );
    },

    deleteAcademicLevel: async id => {
        return await axiosInstance.delete(API_URLS.ACADEMIC_LEVELS.DELETE(id));
    }
};
