import { useQueryClient } from '@tanstack/react-query';
import { teachersService } from '../services/teachers.service';
import { API_KEYS } from '../endpoints';
import useCustomQuery from '../../utils/hooks/global/useCustomQuery';
import useCustomMutation from '../../utils/hooks/global/useCustomMutation';
import { prepareFormData } from '@/utils/helpers/global.fns';

export const useTeachersQuery = (params = {}, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.TEACHERS, params],
        queryFn: () => teachersService.getTeachers(params),
        ...options
    });
};

export const useTeacherQuery = (id, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.TEACHERS, id],
        queryFn: () => teachersService.getTeacher(id),
        ...options
    });
};

export const useUnlicensedTeachersQuery = (params = {}, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.LICENSES, 'unlicensed-teachers', params],
        queryFn: () => teachersService.getUnlicensedTeachers(params),
        ...options
    });
};

export const usePendingTeacherLicensesQuery = (params = {}, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.TEACHER_LICENSES, params],
        queryFn: () => teachersService.getPendingTeacherLicenses(params),
        ...options
    });
};

export const useCreateTeacherMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data =>
            teachersService.createTeacher(prepareFormData(data)),
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
        mutationFn: data =>
            teachersService.updateTeacher(data.id, prepareFormData(data)),
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

export const useIssueTeacherLicenseMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: ({ teacherId, data }) =>
            teachersService.issueTeacherLicense(teacherId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [API_KEYS.TEACHERS] });
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.TEACHER_LICENSES]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useRenewTeacherLicenseMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: teacherId => teachersService.renewTeacherLicense(teacherId),
        showErrorToast: false,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [API_KEYS.TEACHERS] });
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.TEACHER_LICENSES]
            });
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

export const useExportExampleFileMutation = () => {
    return useCustomMutation({
        mutationFn: params => teachersService.exportExampleFile(params),
        onError: error => {
            console.log(error);
        }
    });
};
