import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';

export const privacyPoliciesService = {
    getPrivacyPolicies: async () => {
        return await axiosInstance.get(API_URLS.PRIVACY_POLICIES.GET);
    },

    updatePrivacyPolicies: async data => {
        return await axiosInstance.post(API_URLS.PRIVACY_POLICIES.UPDATE, data);
    },

    deletePrivacyPolicies: async () => {
        return await axiosInstance.delete(API_URLS.PRIVACY_POLICIES.DELETE);
    }
};
