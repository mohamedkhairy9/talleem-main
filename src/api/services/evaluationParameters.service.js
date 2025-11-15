import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';

export const evaluationParametersService = {
    getEvaluationParameters: async params => {
        return await axiosInstance.get(API_URLS.EVALUATION_PARAMETERS.LIST, {
            params
        });
    },

    getEvaluationParameter: async id => {
        return await axiosInstance.get(API_URLS.EVALUATION_PARAMETERS.DETAILS(id));
    },

    createEvaluationParameter: async data => {
        return await axiosInstance.post(API_URLS.EVALUATION_PARAMETERS.CREATE, data);
    },

    updateEvaluationParameter: async (id, data) => {
        return await axiosInstance.put(
            API_URLS.EVALUATION_PARAMETERS.UPDATE(id),
            data
        );
    },

    deleteEvaluationParameter: async id => {
        return await axiosInstance.delete(API_URLS.EVALUATION_PARAMETERS.DELETE(id));
    }
};