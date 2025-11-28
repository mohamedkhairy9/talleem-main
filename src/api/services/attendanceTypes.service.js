import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';

export const attendanceTypesService = {
    getAttendanceTypes: async params => {
        return await axiosInstance.get(API_URLS.ATTENDANCES_TYPES.LIST, {
            params
        });
    },

    getAttendanceType: async id => {
        return await axiosInstance.get(API_URLS.ATTENDANCES_TYPES.DETAILS(id));
    },

    createAttendanceType: async data => {
        return await axiosInstance.post(
            API_URLS.ATTENDANCES_TYPES.CREATE,
            data
        );
    },

    updateAttendanceType: async (id, data) => {
        return await axiosInstance.put(
            API_URLS.ATTENDANCES_TYPES.UPDATE(id),
            data
        );
    },

    deleteAttendanceType: async id => {
        return await axiosInstance.delete(
            API_URLS.ATTENDANCES_TYPES.DELETE(id)
        );
    }
};
