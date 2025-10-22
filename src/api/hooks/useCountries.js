import { useQueryClient } from '@tanstack/react-query';
import { countriesService } from '../services/countries.service';
import { API_KEYS } from '../endpoints';
import useCustomQuery from '../../utils/hooks/global/useCustomQuery';
import useCustomMutation from '../../utils/hooks/global/useCustomMutation';

export const useCountriesQuery = params => {
    return useCustomQuery({
        queryKey: [API_KEYS.COUNTRIES, params],
        queryFn: () => countriesService.getCountries(params)
    });
};

export const useCountryQuery = id => {
    return useCustomQuery({
        queryKey: [API_KEYS.COUNTRIES, id],
        queryFn: () => countriesService.getCountry(id)
    });
};

export const useCreateCountryMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data => countriesService.createCountry(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.COUNTRIES]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useUpdateCountryMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: ({ id, data }) => countriesService.updateCountry(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.COUNTRIES]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useDeleteCountryMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: id => countriesService.deleteCountry(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.COUNTRIES]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};
