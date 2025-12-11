import { API_KEYS } from '../endpoints';
import useCustomQuery from '../../utils/hooks/global/useCustomQuery';
import { joinRequestFormsService } from '../services/joinRequestForms.service';

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

