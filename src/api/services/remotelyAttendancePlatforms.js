import { axiosInstance } from "../axiosInstance"
import { API_URLS } from "../endpoints"

export const remotelyAttendancePlatformsServices = {
    getRemotelyAttendancePlatforms: async (params) => {
        return await axiosInstance.get(API_URLS.REMOTELY_ATTENDANCE_PLATFROMS.LIST, { params })
    },

    createRemotelyAttendancePlatform: async (data) => {
        return await axiosInstance.get(API_URLS.REMOTELY_ATTENDANCE_PLATFROMS.CREATE, data)
    },

    getRemotelyAttendancePlatform: async (id) => {
        return await axiosInstance.get(API_URLS.REMOTELY_ATTENDANCE_PLATFROMS.DETAILS(id))
    },

    updateRemotelyAttendancePlatform: async (id, data) => {
        return await axiosInstance.get(API_URLS.REMOTELY_ATTENDANCE_PLATFROMS.UPDATE(id), data)
    },

    deleteRemotelyAttendancePlatform: async (id) => {
        return await axiosInstance.get(API_URLS.REMOTELY_ATTENDANCE_PLATFROMS.DELETE(id))
    },
}