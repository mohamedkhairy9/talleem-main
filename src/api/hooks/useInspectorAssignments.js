import { useQueryClient } from '@tanstack/react-query';
import { inspectorAssignmentsService } from '../services/inspectorAssignments.service';
import { API_KEYS } from '../endpoints';
import useCustomQuery from '../../utils/hooks/global/useCustomQuery';
import useCustomMutation from '../../utils/hooks/global/useCustomMutation';

export const useInspectorAssignmentsQuery = (params = {}, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.INSPECTOR_ASSIGNMENTS, params],
        queryFn: () => inspectorAssignmentsService.getInspectorAssignments(params),
        ...options
    });
};

export const useInspectorAssignmentQuery = (id, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.INSPECTOR_ASSIGNMENTS, id],
        queryFn: () => inspectorAssignmentsService.getInspectorAssignment(id),
        ...options
    });
};

export const useCreateInspectorAssignmentMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data => inspectorAssignmentsService.createInspectorAssignment(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.INSPECTOR_ASSIGNMENTS]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useUpdateInspectorAssignmentMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data =>
            inspectorAssignmentsService.updateInspectorAssignment(data.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.INSPECTOR_ASSIGNMENTS]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useDeleteInspectorAssignmentMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: id => inspectorAssignmentsService.deleteInspectorAssignment(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.INSPECTOR_ASSIGNMENTS]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};
