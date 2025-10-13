import { axiosInstance } from '../axiosInstance';
import { API_URLS } from '../endpoints';
import { prepareFormData } from '../../utils/helpers/global.fns';

export const generalBannersService = {
    getGeneralBanners: async params => {
        return await axiosInstance.get(API_URLS.GENERAL_BANNERS.LIST, {
            params
        });
    },

    getGeneralBanner: async id => {
        return await axiosInstance.get(API_URLS.GENERAL_BANNERS.DETAILS(id));
    },

    createGeneralBanner: async data => {
        const formData = prepareFormData(data);

        return await axiosInstance.post(
            API_URLS.GENERAL_BANNERS.CREATE,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
    },

    updateGeneralBanner: async (id, data) => {
        const { id: _, ...dataWithoutId } = data;

        // Prepare FormData with _method for Laravel
        const formData = prepareFormData({
            ...dataWithoutId,
            _method: 'POST'
        });

        return await axiosInstance.post(
            API_URLS.GENERAL_BANNERS.UPDATE(id),
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
    },

    deleteGeneralBanner: async id => {
        return await axiosInstance.delete(API_URLS.GENERAL_BANNERS.DELETE(id));
    }
};
