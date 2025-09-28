import axios from 'axios';
import { useUserStore } from '../utils/stores/user.store';

const baseURL =
    import.meta.env.VITE_API_BASE_URL ||
    'https://api-tallam.vocus-dev2.com/api/dashboard';

export const axiosInstance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Attach token automatically from Zustand
axiosInstance.interceptors.request.use(
    config => {
        const token = useUserStore.getState().access_token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    response => response.data,
    error => {
        const normalizedError = {
            status: error.response?.status,
            message: error.response?.data?.message || error.message,
            data: error.response?.data
        };

        if (error.response?.status === 401) {
            useUserStore.getState().clearUser();
        }
        return Promise.reject(normalizedError);
    }
);
