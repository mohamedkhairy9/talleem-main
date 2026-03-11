import { useQueryClient } from '@tanstack/react-query';
import { joinRequestFormsService } from '../services/joinRequestForms.service';
import { API_KEYS } from '../endpoints';
import useCustomQuery from '../../utils/hooks/global/useCustomQuery';
import useCustomMutation from '../../utils/hooks/global/useCustomMutation';

export const useJoinRequestFormsQuery = (params = {}, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.JOIN_REQUEST_FORMS, params],
        queryFn: () => joinRequestFormsService.getJoinRequestForms(params),
        ...options
    });
};

export const useJoinRequestFormQuery = (id, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.JOIN_REQUEST_FORMS, id],
        queryFn: () => joinRequestFormsService.getJoinRequestForm(id),
        enabled: !!id,
        ...options
    });
};

export const useCreateJoinRequestFormMutation = () => {
    return useCustomMutation({
        mutationFn: data => joinRequestFormsService.createJoinRequestForm(data),
        mutationKey: 'create-join-request-form',
        queryKeys: [API_KEYS.JOIN_REQUEST_FORMS]
        // Query invalidation is handled automatically by useCustomMutation via queryKeys
    });
};

export const useUpdateJoinRequestFormMutation = () => {
    return useCustomMutation({
        mutationFn: data => joinRequestFormsService.updateJoinRequestForm(data.id, data),
        queryKeys: [API_KEYS.JOIN_REQUEST_FORMS]
        // Query invalidation is handled automatically by useCustomMutation via queryKeys
    });
};

export const useDeleteJoinRequestFormMutation = () => {
    return useCustomMutation({
        mutationFn: id => joinRequestFormsService.deleteJoinRequestForm(id),
        queryKeys: [API_KEYS.JOIN_REQUEST_FORMS]
        // Query invalidation is handled automatically by useCustomMutation via queryKeys
    });
};

export const useReorderJoinRequestFormFieldsMutation = () => {
    return useCustomMutation({
        mutationFn: ({ id, payload }) => joinRequestFormsService.reorderFields(id, payload),
        queryKeys: [API_KEYS.JOIN_REQUEST_FORMS]
    });
};
