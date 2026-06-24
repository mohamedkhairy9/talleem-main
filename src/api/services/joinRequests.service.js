import axios from 'axios';
import { useUserStore } from '@/utils/stores/user.store';
import i18n from '@/i18n';
import { isBranchManagerOnly, isSuperAdminUser } from '../axiosInstance';
import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';
import { prepareFormData } from '@/utils/helpers/global.fns';
import { resolveJoinRequestsListPath } from './joinRequestsRouting';

/** Remove params that have no value (for branch manager: front API should not receive empty params). */
function stripEmptyParams(params) {
    if (!params || typeof params !== 'object') return {};
    return Object.fromEntries(
        Object.entries(params).filter(([, value]) => {
            if (value === null || value === undefined || value === '') return false;
            if (Array.isArray(value) && value.length === 0) return false;
            return true;
        })
    );
}

// Join requests: always use front API base URL (not dashboard). Do not use axiosInstance.
const JOIN_REQUESTS_BASE_URL =
    import.meta.env.VITE_API_BASE_URL_FRONT || 'https://api-tallam.vocus-dev2.com/api/front';

if (import.meta.env.DEV) {
    console.log('[joinRequests] client baseURL:', JOIN_REQUESTS_BASE_URL);
}

const joinRequestsClient = axios.create({
    baseURL: JOIN_REQUESTS_BASE_URL,
    headers: { 'Content-Type': 'application/json' }
});

joinRequestsClient.interceptors.request.use(config => {
    const token = useUserStore.getState().access_token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    config.headers['Accept-Language'] = i18n.language || 'en';

    // Debug: log full URL to verify we hit /api/front not /api/dashboard
    const fullUrl = config.baseURL && config.url ? `${config.baseURL.replace(/\/$/, '')}${config.url.startsWith('/') ? config.url : '/' + config.url}` : config.url;
    if (import.meta.env.DEV) {
        console.log('[joinRequests]', config.method?.toUpperCase(), fullUrl, config.params || '');
    }

    return config;
});

joinRequestsClient.interceptors.response.use(
    res => res.data,
    err => {
        if (err.response?.status === 401) useUserStore.getState().clearUser();
        return Promise.reject({
            status: err.response?.status,
            message: err.response?.data?.message || err.response?.data?.error || err.message,
            data: err.response?.data
        });
    }
);

export const joinRequestsService = {
    getJoinRequests: (params, options = {}) => {
        const branchManager = isBranchManagerOnly();
        const mode = options.mode || 'auto';
        const scoped = !isSuperAdminUser();
        const finalParams = branchManager ? stripEmptyParams(params) : params ?? {};
        const listPath = resolveJoinRequestsListPath({ mode, scoped });
        const client = branchManager ? joinRequestsClient : axiosInstance;
        return client.get(listPath, { params: finalParams });
    },
    getAllJoinRequests: async (params, options = {}) => {
        const branchManager = isBranchManagerOnly();
        const mode = options.mode || 'auto';
        const scoped = !isSuperAdminUser();
        const finalParams = branchManager ? stripEmptyParams(params) : params ?? {};
        const listPath = resolveJoinRequestsListPath({ mode, scoped });
        const client = branchManager ? joinRequestsClient : axiosInstance;

        const firstPage = await client.get(listPath, {
            params: { ...finalParams, page: 1 }
        });

        const firstPageItems = Array.isArray(firstPage?.data) ? firstPage.data : [];
        const totalItems = Number(firstPage?.meta?.total ?? firstPageItems.length);
        const perPage = Number(firstPage?.meta?.per_page ?? (firstPageItems.length || 20));
        const totalPages =
            totalItems > 0 && perPage > 0 ? Math.ceil(totalItems / perPage) : 1;

        if (totalPages <= 1) {
            return firstPage;
        }

        const remainingPages = await Promise.all(
            Array.from({ length: totalPages - 1 }, (_, index) =>
                client.get(listPath, {
                    params: { ...finalParams, page: index + 2 }
                })
            )
        );

        const allItems = [
            ...firstPageItems,
            ...remainingPages.flatMap(response =>
                Array.isArray(response?.data) ? response.data : []
            )
        ];

        return {
            ...firstPage,
            data: allItems,
            meta: {
                ...(firstPage?.meta || {}),
                total: allItems.length,
                current_page: 1,
                last_page: 1,
                per_page: allItems.length || perPage
            }
        };
    },
    getJoinRequestDetails: id => {
        const client = isBranchManagerOnly() ? joinRequestsClient : axiosInstance;
        return client.get(API_URLS.JOIN_REQUESTS.DETAILS(id));
    },
    getJoinRequestLogs: id => {
        const client = isBranchManagerOnly() ? joinRequestsClient : axiosInstance;
        return client.get(API_URLS.JOIN_REQUESTS.LOGS(id));
    },
    processStep: (id, data) => {
        const formData = prepareFormData(data);
        const opts = { headers: { 'Content-Type': 'multipart/form-data' } };
        // Branch manager: use front base URL for process step too
        const client = isBranchManagerOnly() ? joinRequestsClient : axiosInstance;
        return client.post(API_URLS.JOIN_REQUESTS.PROCESS_STEP(id), formData, opts);
    }
};

