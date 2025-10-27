import { multipartFormData } from '@/utils/constants/global.constants';
import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';

export const teachersService = {
    getTeachers: async params => {
        return await axiosInstance.get(API_URLS.TEACHERS.LIST, { params });
    },

    getTeacher: async id => {
        return await axiosInstance.get(API_URLS.TEACHERS.DETAILS(id));
    },

    createTeacher: async data => {
        return await axiosInstance.post(API_URLS.TEACHERS.CREATE, data,multipartFormData);
    },

    updateTeacher: async (id, data) => {
        return await axiosInstance.post(API_URLS.TEACHERS.UPDATE(id), data,multipartFormData);
    },

    deleteTeacher: async id => {
        return await axiosInstance.delete(API_URLS.TEACHERS.DELETE(id));
    },

    importTeachers: async data => {
        return await axiosInstance.post(API_URLS.TEACHERS.IMPORT, data);
    },

    exportTeachers: async params => {
        return await axiosInstance.get(API_URLS.TEACHERS.EXPORT, {
            params,
            responseType: 'blob'
        });
    }
};
