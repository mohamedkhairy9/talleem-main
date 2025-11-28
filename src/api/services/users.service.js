import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';

export const usersService = {
    getUsers: async params => {
        return await axiosInstance.get(API_URLS.USERS.LIST, { params });
    },

    getUser: async id => {
        return await axiosInstance.get(API_URLS.USERS.DETAILS(id));
    },

    createUser: async data => {
        return await axiosInstance.post(API_URLS.USERS.CREATE, data);
    },

    updateUser: async (id, data) => {
        return await axiosInstance.put(API_URLS.USERS.UPDATE(id), data);
    },

    deleteUser: async id => {
        return await axiosInstance.delete(API_URLS.USERS.DELETE(id));
    }
};
