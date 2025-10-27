import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';

export const branchAdministrationsService = {
    getBranchAdministrations: async params => {
        return await axiosInstance.get(API_URLS.BRANCH_ADMINISTRATIONS.LIST, {
            params
        });
    },

    getBranchAdministration: async id => {
        return await axiosInstance.get(
            API_URLS.BRANCH_ADMINISTRATIONS.DETAILS(id)
        );
    },

    createBranchAdministration: async data => {
        return await axiosInstance.post(
            API_URLS.BRANCH_ADMINISTRATIONS.CREATE,
            data
        );
    },

    updateBranchAdministration: async (id, data) => {
        return await axiosInstance.put(
            API_URLS.BRANCH_ADMINISTRATIONS.UPDATE(id),
            data
        );
    },

    deleteBranchAdministration: async id => {
        return await axiosInstance.delete(
            API_URLS.BRANCH_ADMINISTRATIONS.DELETE(id)
        );
    }
};
