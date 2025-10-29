import { useQueryClient } from '@tanstack/react-query';
import { studentsService } from '../services/students.service';
import { API_KEYS } from '../endpoints';
import useCustomQuery from '../../utils/hooks/global/useCustomQuery';
import useCustomMutation from '../../utils/hooks/global/useCustomMutation';
import { prepareFormData } from '@/utils/helpers/global.fns';

export const useStudentsQuery = params => {
    return useCustomQuery({
        queryKey: [API_KEYS.STUDENTS, params],
        queryFn: () => studentsService.getStudents(params)
    });
};

export const useStudentQuery = id => {
    return useCustomQuery({
        queryKey: [API_KEYS.STUDENTS, id],
        queryFn: () => studentsService.getStudent(id)
    });
};

export const useCreateStudentMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data =>
            studentsService.createStudent(prepareFormData(data)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [API_KEYS.STUDENTS] });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useUpdateStudentMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data =>
            studentsService.updateStudent(data.id, prepareFormData(data)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [API_KEYS.STUDENTS] });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useDeleteStudentMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: id => studentsService.deleteStudent(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [API_KEYS.STUDENTS] });
        },
        onError: error => {
            console.log(error);
        }
    });
};
