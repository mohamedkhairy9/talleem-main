import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';

export const memorizationProgramEntityTypesService = {
    getMemorizationProgramEntityTypes: async params => {
        return await axiosInstance.get(
            API_URLS.MEMORIZATION_PROGRAM_ENTITY_TYPES.LIST,
            { params }
        );
    },

    getMemorizationProgramEntityType: async id => {
        return await axiosInstance.get(
            API_URLS.MEMORIZATION_PROGRAM_ENTITY_TYPES.DETAILS(id)
        );
    },

    createMemorizationProgramEntityType: async data => {
        return await axiosInstance.post(
            API_URLS.MEMORIZATION_PROGRAM_ENTITY_TYPES.CREATE,
            data
        );
    },

    updateMemorizationProgramEntityType: async (id, data) => {
        return await axiosInstance.put(
            API_URLS.MEMORIZATION_PROGRAM_ENTITY_TYPES.UPDATE(id),
            data
        );
    },

    deleteMemorizationProgramEntityType: async id => {
        return await axiosInstance.delete(
            API_URLS.MEMORIZATION_PROGRAM_ENTITY_TYPES.DELETE(id)
        );
    }
};
