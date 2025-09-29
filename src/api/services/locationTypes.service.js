import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';

export const locationTypesService = {
    getLocationTypes: async params => {
        return await axiosInstance.get(API_URLS.LOCATION_TYPES.LIST, {
            params
        });
    },

    getLocationType: async id => {
        return await axiosInstance.get(API_URLS.LOCATION_TYPES.DETAILS(id));
    },

    createLocationType: async data => {
        return await axiosInstance.post(API_URLS.LOCATION_TYPES.CREATE, data);
    },

    updateLocationType: async (id, data) => {
        return await axiosInstance.put(
            API_URLS.LOCATION_TYPES.UPDATE(id),
            data
        );
    },

    deleteLocationType: async id => {
        return await axiosInstance.delete(API_URLS.LOCATION_TYPES.DELETE(id));
    }
};
