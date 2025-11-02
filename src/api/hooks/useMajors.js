import { useQueryClient } from '@tanstack/react-query';
import { mainProgramsService } from '../services/mainPrograms.service';
import { API_KEYS } from '../endpoints';
import useCustomQuery from '../../utils/hooks/global/useCustomQuery';
import useCustomMutation from '../../utils/hooks/global/useCustomMutation';
import { majorsService } from '../services/majors.service';

export const useMajorsQuery = (params = {}, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.MAJORS, params],
        queryFn: () => majorsService.getMajors(params),
        ...options
    });
};

export const useMajorQuery = (id, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.MAJORS, id],
        queryFn: () => majorsService.getMajor(id),
        ...options
    });
};

export const useCreateMajorMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data => majorsService.createMajor(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.MAJORS]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useUpdateMajorMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data =>
            majorsService.updateMajor(data.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.MAJORS]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useDeleteMajorMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: id => majorsService.deleteMajor(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.MAJORS]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};
