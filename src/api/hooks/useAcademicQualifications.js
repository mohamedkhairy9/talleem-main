import { useQueryClient } from '@tanstack/react-query';
import { academicQualificationsService } from '../services/academicQualifications.service';
import { API_KEYS } from '../endpoints';
import useCustomQuery from '../../utils/hooks/global/useCustomQuery';
import useCustomMutation from '../../utils/hooks/global/useCustomMutation';

export const useAcademicQualificationsQuery = params => {
    return useCustomQuery({
        queryKey: [API_KEYS.ACADAMIC_QUALIFICATIONS, params],
        queryFn: () => academicQualificationsService.getAcademicQualifications(params)
    });
};

export const useAcademicQualificationQuery = id => {
    return useCustomQuery({
        queryKey: [API_KEYS.ACADAMIC_QUALIFICATIONS, id],
        queryFn: () => academicQualificationsService.getAcademicQualification(id)
    });
};

export const useCreateAcademicQualificationMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data => academicQualificationsService.createAcademicQualification(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [API_KEYS.ACADAMIC_QUALIFICATIONS] });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useUpdateAcademicQualificationMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data => academicQualificationsService.updateAcademicQualification(data.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [API_KEYS.ACADAMIC_QUALIFICATIONS] });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useDeleteAcademicQualificationMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: id => academicQualificationsService.deleteAcademicQualification(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [API_KEYS.ACADAMIC_QUALIFICATIONS] });
        },
        onError: error => {
            console.log(error);
        }
    });
};