import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';

export const examSegmentsCountService = {
    getExamSegmentsCount: async params => {
        return await axiosInstance.get(API_URLS.EXAM_SEGMENTS_COUNT.LIST, {
            params
        });
    },

    getExamSegmentsCountItem: async id => {
        return await axiosInstance.get(API_URLS.EXAM_SEGMENTS_COUNT.DETAILS(id));
    },

    createExamSegmentsCount: async data => {
        return await axiosInstance.post(
            API_URLS.EXAM_SEGMENTS_COUNT.CREATE,
            data
        );
    },

    updateExamSegmentsCount: async (id, data) => {
        return await axiosInstance.put(
            API_URLS.EXAM_SEGMENTS_COUNT.UPDATE(id),
            data
        );
    },

    deleteExamSegmentsCount: async id => {
        return await axiosInstance.delete(
            API_URLS.EXAM_SEGMENTS_COUNT.DELETE(id)
        );
    }
};