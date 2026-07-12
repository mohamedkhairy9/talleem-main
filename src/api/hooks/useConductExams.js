import { useQueryClient } from '@tanstack/react-query';
import { API_KEYS } from '../endpoints';
import { conductExamsService } from '../services/conductExams.service';
import useCustomMutation from '../../utils/hooks/global/useCustomMutation';
import useCustomQuery from '../../utils/hooks/global/useCustomQuery';

export const useConductExamBranchesQuery = (params = {}, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.CONDUCT_EXAMS, 'branches', params],
        queryFn: () => conductExamsService.getBranches(params),
        ...options
    });
};

export const useConductExamEntitiesQuery = (params = {}, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.CONDUCT_EXAMS, 'entities', params],
        queryFn: () => conductExamsService.getEntities(params),
        ...options
    });
};

export const useConductExamTodayQuery = (params = {}, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.CONDUCT_EXAMS, 'today', params],
        queryFn: () => conductExamsService.getTodayExams(params),
        ...options
    });
};

export const useConductExamDetailsQuery = (
    scheduledExamId,
    options = {}
) => {
    return useCustomQuery({
        queryKey: [API_KEYS.CONDUCT_EXAMS, 'details', scheduledExamId],
        queryFn: () => conductExamsService.getScheduledExam(scheduledExamId),
        enabled: !!scheduledExamId,
        ...options
    });
};

export const useConductExamEvaluationTemplatesQuery = (
    params = {},
    options = {}
) => {
    return useCustomQuery({
        queryKey: [API_KEYS.CONDUCT_EXAMS, 'evaluation-templates', params],
        queryFn: () => conductExamsService.getEvaluationTemplates(params),
        ...options
    });
};

export const useConductExamStudentResultQuery = (
    scheduledExamId,
    studentId,
    options = {}
) => {
    return useCustomQuery({
        queryKey: [
            API_KEYS.CONDUCT_EXAMS,
            'student-result',
            scheduledExamId,
            studentId
        ],
        queryFn: () =>
            conductExamsService.getStudentResult(scheduledExamId, studentId),
        enabled: !!scheduledExamId && !!studentId,
        ...options
    });
};

export const useStartConductExamMutation = () => {
    const queryClient = useQueryClient();

    return useCustomMutation({
        mutationFn: ({ scheduledExamId, studentId, data }) =>
            conductExamsService.startStudentExam(
                scheduledExamId,
                studentId,
                data
            ),
        showErrorToast: false,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.CONDUCT_EXAMS]
            });
        }
    });
};

export const useSubmitConductExamMutation = () => {
    const queryClient = useQueryClient();

    return useCustomMutation({
        mutationFn: ({ scheduledExamId, studentId, data }) =>
            conductExamsService.submitStudentExam(
                scheduledExamId,
                studentId,
                data
            ),
        showErrorToast: false,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.CONDUCT_EXAMS]
            });
        }
    });
};
