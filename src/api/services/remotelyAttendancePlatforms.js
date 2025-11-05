import { axiosInstance } from "../axiosInstance"
import { API_URLS } from "../endpoints"

export const remotelyAttendancePlatformsServices = {
    getRemotelyAttendancePlatforms: async (params) => {
        return await axiosInstance.get(API_URLS.REMOTELY_ATTENDANCE_PLATFORMS.LIST, { params })
    },

    createRemotelyAttendancePlatform: async (data) => {
        return await axiosInstance.post(API_URLS.REMOTELY_ATTENDANCE_PLATFORMS.CREATE, data)
    },

    getRemotelyAttendancePlatform: async (id) => {
        return await axiosInstance.get(API_URLS.REMOTELY_ATTENDANCE_PLATFORMS.DETAILS(id))
    },

    updateRemotelyAttendancePlatform: async (id, data) => {
        return await axiosInstance.put(API_URLS.REMOTELY_ATTENDANCE_PLATFORMS.UPDATE(id), data)
    },

    deleteRemotelyAttendancePlatform: async (id) => {
        return await axiosInstance.delete(API_URLS.REMOTELY_ATTENDANCE_PLATFORMS.DELETE(id))
    },
}