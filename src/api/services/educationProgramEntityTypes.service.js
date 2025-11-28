import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';

export const educationProgramEntityTypesService = {
    getEducationProgramEntityTypes: async params => {
        return await axiosInstance.get(
            API_URLS.EDUCATION_PROGRAM_ENTITY_TYPES.LIST,
            { params }
        );
    },

    getEducationProgramEntityType: async id => {
        return await axiosInstance.get(
            API_URLS.EDUCATION_PROGRAM_ENTITY_TYPES.DETAILS(id)
        );
    },

    createEducationProgramEntityType: async data => {
        return await axiosInstance.post(
            API_URLS.EDUCATION_PROGRAM_ENTITY_TYPES.CREATE,
            data
        );
    },

    updateEducationProgramEntityType: async (id, data) => {
        return await axiosInstance.put(
            API_URLS.EDUCATION_PROGRAM_ENTITY_TYPES.UPDATE(id),
            data
        );
    },

    deleteEducationProgramEntityType: async id => {
        return await axiosInstance.delete(
            API_URLS.EDUCATION_PROGRAM_ENTITY_TYPES.DELETE(id)
        );
    }
};
