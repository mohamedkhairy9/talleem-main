import { useQueryClient } from '@tanstack/react-query';
import { teachersService } from '../services/teachers.service';
import { API_KEYS } from '../endpoints';
import useCustomQuery from '../../utils/hooks/global/useCustomQuery';
import useCustomMutation from '../../utils/hooks/global/useCustomMutation';
import { prepareFormData } from '@/utils/helpers/global.fns';

export const useTeachersQuery = params => {
    return useCustomQuery({
        queryKey: [API_KEYS.TEACHERS, params],
        queryFn: () => teachersService.getTeachers(params)
    });
};

export const useTeacherQuery = id => {
    return useCustomQuery({
        queryKey: [API_KEYS.TEACHERS, id],
        queryFn: () => teachersService.getTeacher(id)
    });
};

export const useCreateTeacherMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data => teachersService.createTeacher(prepareFormData(data)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [API_KEYS.TEACHERS] });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useUpdateTeacherMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data => teachersService.updateTeacher(data.id, prepareFormData(data)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [API_KEYS.TEACHERS] });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useDeleteTeacherMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: id => teachersService.deleteTeacher(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [API_KEYS.TEACHERS] });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useImportTeachersMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data => teachersService.importTeachers(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [API_KEYS.TEACHERS] });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useExportTeachersQuery = params => {
    return useCustomQuery({
        queryKey: [API_KEYS.TEACHERS, 'export', params],
        queryFn: () => teachersService.exportTeachers(params),
        enabled: false // Disabled by default, should be triggered manually
    });
};
