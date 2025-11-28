import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';

export const rolesService = {
    getRoles: async params => {
        return await axiosInstance.get(API_URLS.ROLES.LIST, { params });
    },

    getRole: async id => {
        return await axiosInstance.get(API_URLS.ROLES.DETAILS(id));
    },

    createRole: async data => {
        return await axiosInstance.post(API_URLS.ROLES.CREATE, data);
    },

    updateRole: async (id, data) => {
        return await axiosInstance.put(API_URLS.ROLES.UPDATE(id), data);
    },

    deleteRole: async id => {
        return await axiosInstance.delete(API_URLS.ROLES.DELETE(id));
    },
    assignPermission: async (roleId, data) => {
        return await axiosInstance.post(
            API_URLS.PERMISSION_ASSIGNMENT.ADD(roleId),
            data
        );
    },
    removePermission: async (roleId, data) => {
        return await axiosInstance.delete(
            API_URLS.PERMISSION_ASSIGNMENT.REMOVE(roleId),
            data
        );
    }
};
