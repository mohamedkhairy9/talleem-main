import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';

export const authService = {
    login: data => {
        const payload = { ...data };

        if (payload.email && !payload.national_id) {
            payload.national_id = payload.email;
            delete payload.email;
        }

        return axiosInstance.post(API_URLS.AUTH.LOGIN, payload);
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
