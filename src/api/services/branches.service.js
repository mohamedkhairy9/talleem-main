import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';

export const branchesService = {
    getBranches: async params => {
        return await axiosInstance.get(API_URLS.BRANCHES.LIST, { params });
    },

    getBranch: async id => {
        return await axiosInstance.get(API_URLS.BRANCHES.DETAILS(id));
    },

    createBranch: async data => {
        return await axiosInstance.post(API_URLS.BRANCHES.CREATE, data);
    },

    updateBranch: async (id, data) => {
        return await axiosInstance.put(API_URLS.BRANCHES.UPDATE(id), data);
    },

    deleteBranch: async id => {
        return await axiosInstance.delete(API_URLS.BRANCHES.DELETE(id));
    }
};
