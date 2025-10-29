import { useQueryClient } from '@tanstack/react-query';
import { citiesService } from '../services/cities.service';
import { API_KEYS } from '../endpoints';
import useCustomQuery from '../../utils/hooks/global/useCustomQuery';
import useCustomMutation from '../../utils/hooks/global/useCustomMutation';

export const useCitiesQuery = (params = {}, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.CITIES, params],
        queryFn: () => citiesService.getCities(params),
        ...options
    });
};

export const useCityQuery = (id, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.CITIES, id],
        queryFn: () => citiesService.getCity(id),
        ...options
    });
};

export const useCreateCityMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data => citiesService.createCity(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [API_KEYS.CITIES] });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useUpdateCityMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data => citiesService.updateCity(data.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [API_KEYS.CITIES] });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useDeleteCityMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: id => citiesService.deleteCity(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [API_KEYS.CITIES] });
        },
        onError: error => {
            console.log(error);
        }
    });
};
