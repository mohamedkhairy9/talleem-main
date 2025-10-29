import { useQueryClient } from '@tanstack/react-query';
import { mainProgramsService } from '../services/mainPrograms.service';
import { API_KEYS } from '../endpoints';
import useCustomQuery from '../../utils/hooks/global/useCustomQuery';
import useCustomMutation from '../../utils/hooks/global/useCustomMutation';

export const useMainProgramsQuery = (params = {}, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.MAIN_PROGRAMS, params],
        queryFn: () => mainProgramsService.getMainPrograms(params),
        ...options
    });
};

export const useMainProgramQuery = (id, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.MAIN_PROGRAMS, id],
        queryFn: () => mainProgramsService.getMainProgram(id),
        ...options
    });
};

export const useCreateMainProgramMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data => mainProgramsService.createMainProgram(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.MAIN_PROGRAMS]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useUpdateMainProgramMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data =>
            mainProgramsService.updateMainProgram(data.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.MAIN_PROGRAMS]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useDeleteMainProgramMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: id => mainProgramsService.deleteMainProgram(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.MAIN_PROGRAMS]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};
