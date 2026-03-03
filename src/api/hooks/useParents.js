import { useQueryClient } from '@tanstack/react-query';
import { parentsService } from '../services/parents.service';
import { API_KEYS } from '../endpoints';
import useCustomQuery from '../../utils/hooks/global/useCustomQuery';
import useCustomMutation from '../../utils/hooks/global/useCustomMutation';

export const useParentsQuery = (params = {}, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.PARENTS, params],
        queryFn: () => parentsService.getParents(params),
        ...options
    });
};

export const useParentQuery = (id, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.PARENTS, id],
        queryFn: () => parentsService.getParent(id),
        ...options
    });
};

export const useCreateParentMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data => parentsService.createParent(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.PARENTS]
            });
        }
    });
};

export const useUpdateParentMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data => parentsService.updateParent(data.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.PARENTS]
            });
        }
    });
};

export const useDeleteParentMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: id => parentsService.deleteParent(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.PARENTS]
            });
        }
    });
};

function buildAssignStudentFormData({ student_id, kinship_id }) {
    const formData = new FormData();
    if (student_id != null && student_id !== '') formData.append('student_id', student_id);
    if (kinship_id != null && kinship_id !== '') formData.append('kinship_id', kinship_id);
    return formData;
}

export const useAssignStudentToParentMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: ({ parentId, student_id, kinship_id }) =>
            parentsService.assignStudent(parentId, buildAssignStudentFormData({ student_id, kinship_id })),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.PARENTS]
            });
        }
    });
};

export const useRemoveStudentFromParentMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: ({ parentId, student_id }) =>
            parentsService.removeStudent(parentId, student_id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.PARENTS]
            });
        }
    });
};
