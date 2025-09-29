import { useQueryClient } from '@tanstack/react-query';
import { academicYearsService } from '../services/academicYears.service';
import { API_KEYS } from '../endpoints';
import useCustomQuery from '../../utils/hooks/global/useCustomQuery';
import useCustomMutation from '../../utils/hooks/global/useCustomMutation';

export const useAcademicYearsQuery = params => {
    return useCustomQuery({
        queryKey: [API_KEYS.ACADEMIC_YEARS, params],
        queryFn: () => academicYearsService.getAcademicYears(params)
    });
};

export const useAcademicYearQuery = id => {
    return useCustomQuery({
        queryKey: [API_KEYS.ACADEMIC_YEARS, id],
        queryFn: () => academicYearsService.getAcademicYear(id)
    });
};

export const useCreateAcademicYearMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data => academicYearsService.createAcademicYear(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.ACADEMIC_YEARS]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useUpdateAcademicYearMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data =>
            academicYearsService.updateAcademicYear(data.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.ACADEMIC_YEARS]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useDeleteAcademicYearMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: id => academicYearsService.deleteAcademicYear(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.ACADEMIC_YEARS]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};
