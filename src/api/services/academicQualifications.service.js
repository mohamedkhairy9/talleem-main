import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';

export const academicQualificationsService = {
    
    getAcademicQualifications: async params => {
        return await axiosInstance.get(API_URLS.ACADAMIC_QUALIFICATIONS.LIST, { params });
    },

    getAcademicQualification: async id => {
        return await axiosInstance.get(API_URLS.ACADAMIC_QUALIFICATIONS.DETAILS(id));
    },

    createAcademicQualification: async data => {
        return await axiosInstance.post(API_URLS.ACADAMIC_QUALIFICATIONS.CREATE, data);
    },

    updateAcademicQualification: async (id, data) => {
        return await axiosInstance.put(API_URLS.ACADAMIC_QUALIFICATIONS.UPDATE(id), data);
    },

    deleteAcademicQualification: async id => {
        return await axiosInstance.delete(API_URLS.ACADAMIC_QUALIFICATIONS.DELETE(id));
    }
};