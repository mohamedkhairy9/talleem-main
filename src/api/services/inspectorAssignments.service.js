import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';

export const inspectorAssignmentsService = {
    getInspectorAssignments: async params => {
        return await axiosInstance.get(API_URLS.INSPECTOR_ASSIGNMENTS.LIST, {
            params
        });
    },

    getInspectorAssignment: async id => {
        return await axiosInstance.get(API_URLS.INSPECTOR_ASSIGNMENTS.DETAILS(id));
    },

    createInspectorAssignment: async data => {
        return await axiosInstance.post(
            API_URLS.INSPECTOR_ASSIGNMENTS.CREATE,
            data
        );
    },

    updateInspectorAssignment: async (id, data) => {
        return await axiosInstance.put(
            API_URLS.INSPECTOR_ASSIGNMENTS.UPDATE(id),
            data
        );
    },

    deleteInspectorAssignment: async id => {
        return await axiosInstance.delete(
            API_URLS.INSPECTOR_ASSIGNMENTS.DELETE(id)
        );
    }
};
