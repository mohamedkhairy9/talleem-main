import { useQueryClient } from '@tanstack/react-query';
import { aboutUsService } from '../services/aboutUs.service';
import { API_KEYS } from '../endpoints';
import useCustomQuery from '../../utils/hooks/global/useCustomQuery';
import useCustomMutation from '../../utils/hooks/global/useCustomMutation';

export const useAboutUsQuery = () => {
    return useCustomQuery({
        queryKey: [API_KEYS.ABOUT_US],
        queryFn: () => aboutUsService.getAboutUs()
    });
};

export const useUpdateAboutUsMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data => aboutUsService.updateAboutUs(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [API_KEYS.ABOUT_US] });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useDeleteAboutUsMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: () => aboutUsService.deleteAboutUs(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [API_KEYS.ABOUT_US] });
        },
        onError: error => {
            console.log(error);
        }
    });
};
