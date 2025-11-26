import { useQueryClient } from '@tanstack/react-query';
import { examSegmentsCountService } from '../services/examSegmentsCount.service';
import { API_KEYS } from '../endpoints';
import useCustomQuery from '../../utils/hooks/global/useCustomQuery';
import useCustomMutation from '../../utils/hooks/global/useCustomMutation';

export const useExamSegmentsCountQuery = (params = {}, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.EXAM_SEGMENTS_COUNT, params],
        queryFn: () => examSegmentsCountService.getExamSegmentsCount(params),
        ...options
    });
};

export const useExamSegmentsCountItemQuery = (id, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.EXAM_SEGMENTS_COUNT, id],
        queryFn: () => examSegmentsCountService.getExamSegmentsCountItem(id),
        ...options
    });
};

export const useCreateExamSegmentsCountMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data => examSegmentsCountService.createExamSegmentsCount(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.EXAM_SEGMENTS_COUNT]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useUpdateExamSegmentsCountMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data =>
            examSegmentsCountService.updateExamSegmentsCount(data.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.EXAM_SEGMENTS_COUNT]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useDeleteExamSegmentsCountMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: id => examSegmentsCountService.deleteExamSegmentsCount(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.EXAM_SEGMENTS_COUNT]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};