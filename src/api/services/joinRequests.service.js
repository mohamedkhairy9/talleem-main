import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';
import { prepareFormData } from '@/utils/helpers/global.fns';

export const joinRequestsService = {
    getJoinRequests: params => {
        return axiosInstance.get(API_URLS.JOIN_REQUESTS.LIST, { params });
    },
    processStep: (id, data) => {
        const formData = prepareFormData(data);
        return axiosInstance.post(API_URLS.JOIN_REQUESTS.PROCESS_STEP(id), formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }
};

