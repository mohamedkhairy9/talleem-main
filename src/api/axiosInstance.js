import axios from 'axios';
import { useUserStore } from '../utils/stores/user.store';
import i18n from '../i18n';

const baseURL =
    import.meta.env.VITE_API_BASE_URL ||
    'https://api-tallam.vocus-dev2.com/api/dashboard';

export const axiosInstance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Attach token automatically from Zustand and set Accept-Language header
axiosInstance.interceptors.request.use(
    config => {
        const token = useUserStore.getState().access_token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Set Accept-Language header based on current i18n language
        const currentLanguage = i18n.language || 'en';
        config.headers['Accept-Language'] = currentLanguage;

        // حذف الـ parameters الفاضية من الـ GET requests
        if (config.params) {
            const cleanedParams = {};
            
            Object.keys(config.params).forEach(key => {
                const value = config.params[key];
                
                // إضافة القيمة فقط إذا كانت:
                // - ليست null
                // - ليست undefined
                // - ليست string فاضي
                // - ليست array فاضي
                if (
                    value !== null && 
                    value !== undefined && 
                    value !== '' &&
                    !(Array.isArray(value) && value.length === 0)
                ) {
                    cleanedParams[key] = value;
                }
            });
            
            config.params = cleanedParams;
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