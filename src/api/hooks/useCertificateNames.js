import { useQueryClient } from '@tanstack/react-query';
import { certificateNamesService } from '../services/certificateNames.service';
import { API_KEYS } from '../endpoints';
import useCustomQuery from '../../utils/hooks/global/useCustomQuery';
import useCustomMutation from '../../utils/hooks/global/useCustomMutation';

export const useCertificateNamesQuery = (params = {}, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.CERTIFICATE_NAMES, params],
        queryFn: () => certificateNamesService.getCertificateNames(params),
        ...options
    });
};

export const useCertificateNameQuery = (id, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.CERTIFICATE_NAMES, id],
        queryFn: () => certificateNamesService.getCertificateName(id),
        ...options
    });
};

export const useCreateCertificateNameMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data => certificateNamesService.createCertificateName(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.CERTIFICATE_NAMES]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useUpdateCertificateNameMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data =>
            certificateNamesService.updateCertificateName(data.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.CERTIFICATE_NAMES]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useDeleteCertificateNameMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: id => certificateNamesService.deleteCertificateName(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.CERTIFICATE_NAMES]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};
