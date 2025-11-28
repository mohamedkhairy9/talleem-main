import { notificationTemplatesService } from '../services/notificationTemplates.service';
import { API_KEYS } from '../endpoints';
import useCustomQuery from '../../utils/hooks/global/useCustomQuery';

export const useNotificationTemplatesQuery = (params = {}, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.NOTIFICATION_TEMPLATES, params],
        queryFn: () =>
            notificationTemplatesService.getNotificationTemplates(params),
        ...options
    });
};
