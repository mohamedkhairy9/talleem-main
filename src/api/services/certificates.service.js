import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';

export const certificatesService = {
    getCertificates: async params => {
        return await axiosInstance.get(API_URLS.CERTIFICATES.LIST, {
            params
        });
    },

    getCertificate: async id => {
        return await axiosInstance.get(API_URLS.CERTIFICATES.DETAILS(id));
    },

    createCertificate: async data => {
        return await axiosInstance.post(
            API_URLS.CERTIFICATES.CREATE,
            data,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
    },

    updateCertificate: async (id, data) => {
        return await axiosInstance.put(
            API_URLS.CERTIFICATES.UPDATE(id),
            data,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
    },

    deleteCertificate: async id => {
        return await axiosInstance.delete(
            API_URLS.CERTIFICATES.DELETE(id)
        );
    }
};