import { multipartFormData } from '@/utils/constants/global.constants';
import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';

export const studentsService = {
    getStudents: async params => {
        return await axiosInstance.get(API_URLS.STUDENTS.LIST, { params });
    },

    getStudent: async id => {
        return await axiosInstance.get(API_URLS.STUDENTS.DETAILS(id));
    },

    createStudent: async data => {
        return await axiosInstance.post(
            API_URLS.STUDENTS.CREATE,
            data,
            multipartFormData
        );
    },

    updateStudent: async (id, data) => {
        return await axiosInstance.post(
            API_URLS.STUDENTS.UPDATE(id),
            data,
            multipartFormData
        );
    },

    deleteStudent: async id => {
        return await axiosInstance.delete(API_URLS.STUDENTS.DELETE(id));
    },

    importStudents: async data => {
        return await axiosInstance.post(
            API_URLS.STUDENTS.IMPORT,
            data,
            multipartFormData
        );
    },

    exportExampleFile: async () => {
        return await axiosInstance.get(API_URLS.STUDENTS.EXPORT_EXAMPLE, {
            responseType: 'blob'
        });
    }
};
