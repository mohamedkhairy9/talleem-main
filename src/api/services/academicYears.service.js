import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';

export const academicYearsService = {
    getAcademicYears: async params => {
        return await axiosInstance.get(API_URLS.ACADEMIC_YEARS.LIST, {
            params
        });
    },

    getAcademicYear: async id => {
        return await axiosInstance.get(API_URLS.ACADEMIC_YEARS.DETAILS(id));
    },

    createAcademicYear: async data => {
        return await axiosInstance.post(API_URLS.ACADEMIC_YEARS.CREATE, data);
    },

    updateAcademicYear: async (id, data) => {
        return await axiosInstance.put(
            API_URLS.ACADEMIC_YEARS.UPDATE(id),
            data
        );
    },

    deleteAcademicYear: async id => {
        return await axiosInstance.delete(API_URLS.ACADEMIC_YEARS.DELETE(id));
    }
};
