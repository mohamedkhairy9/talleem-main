import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';

export const onlineAttendancesService = {
    getOnlineAttendances: async params => {
        return await axiosInstance.get(API_URLS.ONLINE_ATTENDANCES.LIST, {
            params
        });
    },

    getOnlineAttendance: async id => {
        return await axiosInstance.get(API_URLS.ONLINE_ATTENDANCES.DETAILS(id));
    },

    createOnlineAttendance: async data => {
        return await axiosInstance.post(
            API_URLS.ONLINE_ATTENDANCES.CREATE,
            data
        );
    },

    updateOnlineAttendance: async (id, data) => {
        return await axiosInstance.put(
            API_URLS.ONLINE_ATTENDANCES.UPDATE(id),
            data
        );
    },

    deleteOnlineAttendance: async id => {
        return await axiosInstance.delete(
            API_URLS.ONLINE_ATTENDANCES.DELETE(id)
        );
    }
};
