import { useQueryClient } from '@tanstack/react-query';
import { academicLevelsService } from '../services/academicLevels.service';
import { API_KEYS } from '../endpoints';
import useCustomQuery from '../../utils/hooks/global/useCustomQuery';
import useCustomMutation from '../../utils/hooks/global/useCustomMutation';

export const useAcademicLevelsQuery = params => {
    return useCustomQuery({
        queryKey: [API_KEYS.ACADEMIC_LEVELS, params],
        queryFn: () => academicLevelsService.getAcademicLevels(params)
    });
};

export const useAcademicLevelQuery = id => {
    return useCustomQuery({
        queryKey: [API_KEYS.ACADEMIC_LEVELS, id],
        queryFn: () => academicLevelsService.getAcademicLevel(id)
    });
};

export const useCreateAcademicLevelMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data => academicLevelsService.createAcademicLevel(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.ACADEMIC_LEVELS]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useUpdateAcademicLevelMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data =>
            academicLevelsService.updateAcademicLevel(data.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.ACADEMIC_LEVELS]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useDeleteAcademicLevelMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: id => academicLevelsService.deleteAcademicLevel(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.ACADEMIC_LEVELS]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};
