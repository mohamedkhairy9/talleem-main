import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';
import { multipartFormData } from '@/utils/constants/global.constants';

export const parentsService = {
    getParents: async params => {
        return await axiosInstance.get(API_URLS.PARENTS.LIST, { params });
    },

    getParent: async id => {
        return await axiosInstance.get(API_URLS.PARENTS.DETAILS(id));
    },

    createParent: async data => {
        return await axiosInstance.post(API_URLS.PARENTS.CREATE, data);
    },

    updateParent: async (id, data) => {
        return await axiosInstance.put(API_URLS.PARENTS.UPDATE(id), data);
    },

    deleteParent: async id => {
        return await axiosInstance.delete(API_URLS.PARENTS.DELETE(id));
    },

    assignStudent: async (parentId, formData) => {
        return await axiosInstance.post(
            API_URLS.PARENTS.ASSIGN_STUDENT(parentId),
            formData,
            multipartFormData
        );
    },

    removeStudent: async (parentId, student_id) => {
        return await axiosInstance.delete(
            API_URLS.PARENTS.REMOVE_STUDENT(parentId),
            { params: { student_id } }
        );
    }
};
