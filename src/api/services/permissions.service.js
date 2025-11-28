import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';

export const permissionsService = {
    getPermissions: async params => {
        return await axiosInstance.get(API_URLS.PERMISSIONS.LIST, { params });
    },

    getPermission: async id => {
        return await axiosInstance.get(API_URLS.PERMISSIONS.DETAILS(id));
    }
};
