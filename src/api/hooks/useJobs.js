import { useQueryClient } from '@tanstack/react-query';
import { jobsService } from '../services/jobs.service';
import { API_KEYS } from '../endpoints';
import useCustomQuery from '../../utils/hooks/global/useCustomQuery';
import useCustomMutation from '../../utils/hooks/global/useCustomMutation';

export const useJobsQuery = (params = {}, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.JOBS, params],
        queryFn: () => jobsService.getJobs(params),
        ...options
    });
};

export const useJobQuery = (id, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.JOBS, id],
        queryFn: () => jobsService.getJob(id),
        ...options
    });
};

export const useCreateJobMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data => jobsService.createJob(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [API_KEYS.JOBS] });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useUpdateJobMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data => jobsService.updateJob(data.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [API_KEYS.JOBS] });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useDeleteJobMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: id => jobsService.deleteJob(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [API_KEYS.JOBS] });
        },
        onError: error => {
            console.log(error);
        }
    });
};
