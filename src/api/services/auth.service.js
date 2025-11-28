import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';

export const authService = {
    login: data => {
        return axiosInstance.post(API_URLS.AUTH.LOGIN, data);
    },

    register: data => {
        return axiosInstance.post(API_URLS.AUTH.REGISTER, data);
    },

    getUser: () => {
        return axiosInstance.get(API_URLS.AUTH.USER);
    },

    logout: () => {
        return axiosInstance.post(API_URLS.AUTH.LOGOUT);
    }
};
