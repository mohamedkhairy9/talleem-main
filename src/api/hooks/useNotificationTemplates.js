import { notificationTemplatesService } from '../services/notificationTemplates.service';
import { API_KEYS } from '../endpoints';
import useCustomQuery from '../../utils/hooks/global/useCustomQuery';
import useCustomMutation from '../../utils/hooks/global/useCustomMutation';
import { useQueryClient } from '@tanstack/react-query';

export const useNotificationTemplatesQuery = (params = {}, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.NOTIFICATION_TEMPLATES, params],
        queryFn: () =>
            notificationTemplatesService.getNotificationTemplates(params),
        ...options
    });
};

export const useNotificationTemplateQuery = (id, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.NOTIFICATION_TEMPLATES, 'details', id],
        queryFn: () => notificationTemplatesService.getNotificationTemplate(id),
        enabled: Boolean(id) && options.enabled !== false,
        ...options
    });
};

export const useUpdateNotificationTemplateMutation = () => {
    const queryClient = useQueryClient();

    return useCustomMutation({
        mutationFn: ({ id, data }) =>
            notificationTemplatesService.updateNotificationTemplate(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.NOTIFICATION_TEMPLATES]
            });
        }
    });
};
