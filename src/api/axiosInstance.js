import axios from 'axios';
import { useUserStore } from '../utils/stores/user.store';
import i18n from '../i18n';
import { ROLE_SUPER_ADMIN, ROLE_BRANCH_ADMIN, normalizeRole } from '../utils/constants/configs';
import { getLocalizedErrorMessage, getRawErrorMessage } from '@/utils/helpers/localizedMessages';

const baseURL =
    import.meta.env.VITE_API_BASE_URL ||
    'https://api-tallam.vocus-dev2.com/api/v1/dashboard';

const baseURLFront =
    import.meta.env.VITE_API_BASE_URL_FRONT ||
    'https://api-tallam.vocus-dev2.com/api/v1/front';

const paramsSerializer = params => {
    const searchParams = new URLSearchParams();
    Object.entries(params || {}).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            value.forEach(v => {
                if (v !== null && v !== undefined && v !== '') {
                    searchParams.append(key, v);
                }
            });
        } else if (value !== null && value !== undefined && value !== '') {
            searchParams.append(key, value);
        }
    });
    return searchParams.toString();
};

export const axiosInstance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json'
    },
    paramsSerializer
});

/** True if user has only branch manager role (no super admin). We check only user.roles (not user_type). */
export function isBranchManagerOnly() {
    const user = useUserStore.getState().user;
    if (!user?.roles?.length) return false;
    const normalized = user.roles.map(normalizeRole).filter(Boolean);
    const hasSuperAdmin = normalized.includes(normalizeRole(ROLE_SUPER_ADMIN));
    const hasBranchAdmin = normalized.includes(normalizeRole(ROLE_BRANCH_ADMIN));
    return hasBranchAdmin && !hasSuperAdmin;
}

/** Axios instance for front API (used by branch manager for join-requests). Same auth/language as main. */
export const axiosInstanceFront = axios.create({
    baseURL: baseURLFront,
    headers: {
        'Content-Type': 'application/json'
    },
    paramsSerializer
});

const requestInterceptor = config => {
    const token = useUserStore.getState().access_token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    const currentLanguage = i18n.language || 'en';
    config.headers['Accept-Language'] = currentLanguage;
    if (config.params) {
        const cleanedParams = {};
        Object.keys(config.params).forEach(key => {
            const value = config.params[key];
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
};

const responseInterceptor = response => response.data;
const responseErrorInterceptor = error => {
    const normalizedError = {
        status: error.response?.status,
        message: getLocalizedErrorMessage(error),
        rawMessage: getRawErrorMessage(error),
        data: error.response?.data
    };
    if (error.response?.status === 401) {
        useUserStore.getState().clearUser();
    }
    return Promise.reject(normalizedError);
};

axiosInstance.interceptors.request.use(requestInterceptor, error => Promise.reject(error));
axiosInstance.interceptors.response.use(responseInterceptor, responseErrorInterceptor);

axiosInstanceFront.interceptors.request.use(requestInterceptor, error => Promise.reject(error));
axiosInstanceFront.interceptors.response.use(responseInterceptor, responseErrorInterceptor);
