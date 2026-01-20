import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';

export const joinRequestsService = {
    getJoinRequests: params => {
        return axiosInstance.get(API_URLS.JOIN_REQUESTS.LIST, { params });
    }
};

