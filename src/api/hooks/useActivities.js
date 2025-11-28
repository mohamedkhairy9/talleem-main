import { useQueryClient } from '@tanstack/react-query';
import { activitiesService } from '../services/activities.service';
import { API_KEYS } from '../endpoints';
import useCustomQuery from '../../utils/hooks/global/useCustomQuery';
import useCustomMutation from '../../utils/hooks/global/useCustomMutation';

export const useActivitiesQuery = (params = {}, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.ACTIVITIES, params],
        queryFn: () => activitiesService.getActivities(params),
        ...options
    });
};

export const useActivityQuery = (id, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.ACTIVITIES, id],
        queryFn: () => activitiesService.getActivity(id),
        ...options
    });
};

export const useCreateActivityMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data => activitiesService.createActivity(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [API_KEYS.ACTIVITIES] });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useUpdateActivityMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data => activitiesService.updateActivity(data.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [API_KEYS.ACTIVITIES] });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useDeleteActivityMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: id => activitiesService.deleteActivity(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [API_KEYS.ACTIVITIES] });
        },
        onError: error => {
            console.log(error);
        }
    });
};
