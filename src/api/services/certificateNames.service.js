import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';

export const certificateNamesService = {
    getCertificateNames: async params => {
        return await axiosInstance.get(API_URLS.CERTIFICATE_NAMES.LIST, {
            params
        });
    },

    getCertificateName: async id => {
        return await axiosInstance.get(API_URLS.CERTIFICATE_NAMES.DETAILS(id));
    },

    createCertificateName: async data => {
        return await axiosInstance.post(
            API_URLS.CERTIFICATE_NAMES.CREATE,
            data
        );
    },

    updateCertificateName: async (id, data) => {
        return await axiosInstance.put(
            API_URLS.CERTIFICATE_NAMES.UPDATE(id),
            data
        );
    },

    deleteCertificateName: async id => {
        return await axiosInstance.delete(
            API_URLS.CERTIFICATE_NAMES.DELETE(id)
        );
    }
};
