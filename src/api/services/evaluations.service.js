import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';

export const evaluationsService = {
    getEvaluations: async params =>
        axiosInstance.get(API_URLS.EVALUATIONS.LIST, { params }),

    getReceivedEvaluations: async params =>
        axiosInstance.get(API_URLS.EVALUATIONS.RECEIVED, { params }),

    getAvailableParameters: async params =>
        axiosInstance.get(API_URLS.EVALUATIONS.AVAILABLE_PARAMETERS, { params }),

    getEvaluationTemplates: async params =>
        axiosInstance.get(API_URLS.EVALUATIONS.TEMPLATES, { params }),

    getEvaluationTemplate: async id =>
        axiosInstance.get(API_URLS.EVALUATIONS.TEMPLATE_DETAILS(id)),

    createEvaluation: async data =>
        axiosInstance.post(API_URLS.EVALUATIONS.CREATE, data),

    getEvaluation: async id =>
        axiosInstance.get(API_URLS.EVALUATIONS.DETAILS(id))
};
