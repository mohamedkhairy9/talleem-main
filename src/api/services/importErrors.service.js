import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';

export const importErrorsService = {
    getImportErrors: async params => {
        return await axiosInstance.get(API_URLS.IMPORT_ERRORS.LIST, { params });
    },
    clearImportErrors: async () => {
        return await axiosInstance.delete(API_URLS.IMPORT_ERRORS.CLEAR);
    }
};

