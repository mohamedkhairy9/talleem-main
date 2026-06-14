import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';

export const generalHolidaysService = {
    getGeneralHolidays: async params => {
        return await axiosInstance.get(API_URLS.GENERAL_HOLIDAYS.LIST, {
            params
        });
    },

    getGeneralHoliday: async id => {
        return await axiosInstance.get(API_URLS.GENERAL_HOLIDAYS.DETAILS(id));
    },

    createGeneralHoliday: async data => {
        return await axiosInstance.post(API_URLS.GENERAL_HOLIDAYS.CREATE, data);
    },

    updateGeneralHoliday: async (id, data) => {
        return await axiosInstance.put(API_URLS.GENERAL_HOLIDAYS.UPDATE(id), data);
    },

    deleteGeneralHoliday: async id => {
        return await axiosInstance.delete(API_URLS.GENERAL_HOLIDAYS.DELETE(id));
    }
};
