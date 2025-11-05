import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';
import { multipartFormData } from '@/utils/constants/global.constants';

export const employeesService = {
    getEmployees: async params => {
        return await axiosInstance.get(API_URLS.EMPLOYEES.LIST, { params });
    },

    getEmployee: async id => {
        return await axiosInstance.get(API_URLS.EMPLOYEES.DETAILS(id));
    },

    createEmployee: async data => {
        return await axiosInstance.post(API_URLS.EMPLOYEES.CREATE, data, multipartFormData);
    },

    updateEmployee: async (id, data) => {
        return await axiosInstance.put(API_URLS.EMPLOYEES.UPDATE(id), data, multipartFormData);
    },

    deleteEmployee: async id => {
        return await axiosInstance.delete(API_URLS.EMPLOYEES.DELETE(id));
    },

    importEmployees: async data => {
        return await axiosInstance.post(
            API_URLS.EMPLOYEES.IMPORT,
            data,
            multipartFormData
        );
    },

    exportExampleFile: async () => {
        return await axiosInstance.get(API_URLS.EMPLOYEES.EXPORT_EXAMPLE, {
            responseType: 'blob'
        });
    }
};

