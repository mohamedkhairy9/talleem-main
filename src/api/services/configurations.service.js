import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';

export const configurationsService = {
    getConfigurations: async (program = 'all') => {
        return await axiosInstance.get(API_URLS.CONFIGURATIONS.LIST, {
            params: { program }
        });
    },

    getConfiguration: async (program, key) => {
        return await axiosInstance.get(API_URLS.CONFIGURATIONS.SHOW(program, key));
    },

    updateConfiguration: async (program, data) => {
        return await axiosInstance.put(
            API_URLS.CONFIGURATIONS.UPDATE(program),
            data
        );
    }
};