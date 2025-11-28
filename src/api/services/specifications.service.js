import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';

export const specificationsService = {
    getSpecifications: async params => {
        return await axiosInstance.get(API_URLS.SPECIFICATIONS.LIST, {
            params
        });
    },

    getSpecification: async id => {
        return await axiosInstance.get(API_URLS.SPECIFICATIONS.DETAILS(id));
    },

    createSpecification: async data => {
        return await axiosInstance.post(API_URLS.SPECIFICATIONS.CREATE, data);
    },

    updateSpecification: async (id, data) => {
        return await axiosInstance.put(
            API_URLS.SPECIFICATIONS.UPDATE(id),
            data
        );
    },

    deleteSpecification: async id => {
        return await axiosInstance.delete(API_URLS.SPECIFICATIONS.DELETE(id));
    }
};
