import { isBranchManagerOnly, isGeneralManagerUser, isSuperAdminUser } from '../axiosInstance';
import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';
import { prepareFormData } from '@/utils/helpers/global.fns';
import { resolveJoinRequestsListPath } from './joinRequestsRouting';

function canOverseeAllJoinRequests() {
    return isSuperAdminUser() || isGeneralManagerUser();
}

export const joinRequestsService = {
    getJoinRequests: (params, options = {}) => {
        const mode = options.mode || 'auto';
        const scoped = !canOverseeAllJoinRequests() && !isBranchManagerOnly();
        const listPath = resolveJoinRequestsListPath({ mode, scoped });
        return axiosInstance.get(listPath, { params: params ?? {} });
    },
    getAllJoinRequests: async (params, options = {}) => {
        const mode = options.mode || 'auto';
        const scoped = !canOverseeAllJoinRequests() && !isBranchManagerOnly();
        const finalParams = params ?? {};
        const listPath = resolveJoinRequestsListPath({ mode, scoped });

        const firstPage = await axiosInstance.get(listPath, {
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
                axiosInstance.get(listPath, {
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
        return axiosInstance.get(API_URLS.JOIN_REQUESTS.DETAILS(id));
    },
    getJoinRequestLogs: id => {
        return axiosInstance.get(API_URLS.JOIN_REQUESTS.LOGS(id));
    },
    processStep: (id, data) => {
        // A "need upload" action creates a form definition for the applicant.
        // It must remain JSON so the nested resubmission_form is not flattened
        // into multipart keys.
        if (Number(data?.status) === 4 && data?.resubmission_form) {
            return axiosInstance.post(API_URLS.JOIN_REQUESTS.PROCESS_STEP(id), {
                status: 4,
                notes: data.notes || null,
                resubmission_form: data.resubmission_form
            });
        }

        const formData = prepareFormData(data);
        const opts = { headers: { 'Content-Type': 'multipart/form-data' } };
        return axiosInstance.post(API_URLS.JOIN_REQUESTS.PROCESS_STEP(id), formData, opts);
    }
};

