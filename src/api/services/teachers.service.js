import { multipartFormData } from '@/utils/constants/global.constants';
import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';

export const teachersService = {
    getTeachers: async params => {
        return await axiosInstance.get(API_URLS.TEACHERS.LIST, { params });
    },

    getTeacher: async id => {
        return await axiosInstance.get(API_URLS.TEACHERS.DETAILS(id));
    },

    getUnlicensedTeachers: async params => {
        return await axiosInstance.get(API_URLS.LICENSES.UNLICENSED_TEACHERS, {
            params
        });
    },

    createTeacher: async data => {
        return await axiosInstance.post(API_URLS.TEACHERS.CREATE, data,multipartFormData);
    },

    updateTeacher: async (id, data) => {
        return await axiosInstance.post(API_URLS.TEACHERS.UPDATE(id), data,multipartFormData);
    },

    deleteTeacher: async id => {
        return await axiosInstance.delete(API_URLS.TEACHERS.DELETE(id));
    },

    getPendingTeacherLicenses: async params => {
        return await axiosInstance.get(API_URLS.TEACHER_LICENSES.PENDING, {
            params
        });
    },

    issueTeacherLicense: async (teacherId, data) => {
        return await axiosInstance.post(
            API_URLS.LICENSES.ISSUE_TEACHER(teacherId),
            data
        );
    },

    renewTeacherLicense: async teacherId => {
        return await axiosInstance.post(
            API_URLS.TEACHER_LICENSES.RENEW(teacherId)
        );
    },

    importTeachers: async data => {
        return await axiosInstance.post(
            API_URLS.TEACHERS.IMPORT,
            data,
            multipartFormData
        );
    },

    exportTeachers: async params => {
        return await axiosInstance.get(API_URLS.TEACHERS.EXPORT, {
            params,
            responseType: 'blob'
        });
    },

    exportExampleFile: async () => {
        return await axiosInstance.get(API_URLS.TEACHERS.EXPORT_EXAMPLE, {
            responseType: 'blob'
        });
    }
};
