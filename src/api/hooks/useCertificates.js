import { useQueryClient } from '@tanstack/react-query';
import { certificatesService } from '../services/certificates.service';
import { API_KEYS } from '../endpoints';
import useCustomQuery from '../../utils/hooks/global/useCustomQuery';
import useCustomMutation from '../../utils/hooks/global/useCustomMutation';

export const useCertificatesQuery = (params = {}, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.CERTIFICATES, params],
        queryFn: () => certificatesService.getCertificates(params),
        ...options
    });
};

export const useCertificateQuery = (id, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.CERTIFICATES, id],
        queryFn: () => certificatesService.getCertificate(id),
        ...options
    });
};

export const useCreateCertificateMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data => certificatesService.createCertificate(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.CERTIFICATES]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useUpdateCertificateMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data =>
            certificatesService.updateCertificate(data.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.CERTIFICATES]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useDeleteCertificateMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: id => certificatesService.deleteCertificate(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.CERTIFICATES]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};