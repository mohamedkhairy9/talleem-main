import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';

export const phasesService = {
    getPhases: async params => {
        return await axiosInstance.get(API_URLS.PHASES.LIST, { params });
    },

    getPhase: async id => {
        return await axiosInstance.get(API_URLS.PHASES.DETAILS(id));
    },

    createPhase: async data => {
        return await axiosInstance.post(API_URLS.PHASES.CREATE, data);
    },

    updatePhase: async (id, data) => {
        return await axiosInstance.put(API_URLS.PHASES.UPDATE(id), data);
    },

    deletePhase: async id => {
        return await axiosInstance.delete(API_URLS.PHASES.DELETE(id));
    },

    reorderSteps: async (phaseId, data) => {
        return await axiosInstance.post(API_URLS.PHASES.REORDER_STEPS(phaseId), data);
    }
};

