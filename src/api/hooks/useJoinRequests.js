import { joinRequestsService } from '../services/joinRequests.service';
import { API_KEYS } from '../endpoints';
import useCustomQuery from '../../utils/hooks/global/useCustomQuery';

export const useJoinRequestsQuery = (params = {}, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.JOIN_REQUESTS, params],
        queryFn: () => joinRequestsService.getJoinRequests(params),
        ...options
    });
};

