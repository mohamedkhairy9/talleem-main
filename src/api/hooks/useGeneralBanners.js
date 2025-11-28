import { useQueryClient } from '@tanstack/react-query';
import { generalBannersService } from '../services/generalBanners.service';
import { API_KEYS } from '../endpoints';
import useCustomQuery from '../../utils/hooks/global/useCustomQuery';
import useCustomMutation from '../../utils/hooks/global/useCustomMutation';

export const useGeneralBannersQuery = (params = {}, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.GENERAL_BANNERS, params],
        queryFn: () => generalBannersService.getGeneralBanners(params),
        ...options
    });
};

export const useGeneralBannerQuery = (id, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.GENERAL_BANNERS, id],
        queryFn: () => generalBannersService.getGeneralBanner(id),
        ...options
    });
};

export const useCreateGeneralBannerMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data => generalBannersService.createGeneralBanner(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.GENERAL_BANNERS]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useUpdateGeneralBannerMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data =>
            generalBannersService.updateGeneralBanner(data.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.GENERAL_BANNERS]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useDeleteGeneralBannerMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: id => generalBannersService.deleteGeneralBanner(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.GENERAL_BANNERS]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};
