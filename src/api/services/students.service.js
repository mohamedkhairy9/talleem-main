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
        return await axiosInstance.post(API_URLS.STUDENTS.CREATE, data);
    },
    updateStudent: async (id, data) => {
        return await axiosInstance.put(API_URLS.STUDENTS.UPDATE(id), data);
    },
    deleteStudent: async id => {
        return await axiosInstance.delete(API_URLS.STUDENTS.DELETE(id));
    }
};
