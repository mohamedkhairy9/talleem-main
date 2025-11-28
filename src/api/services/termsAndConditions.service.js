import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';

export const termsAndConditionsService = {
    getTermsAndConditions: async () => {
        return await axiosInstance.get(API_URLS.TERMS_AND_CONDITIONS.GET);
    },

    updateTermsAndConditions: async data => {
        return await axiosInstance.post(
            API_URLS.TERMS_AND_CONDITIONS.UPDATE,
            data
        );
    },

    deleteTermsAndConditions: async () => {
        return await axiosInstance.delete(API_URLS.TERMS_AND_CONDITIONS.DELETE);
    }
};
