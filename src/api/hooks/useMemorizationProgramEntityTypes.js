import { useQueryClient } from '@tanstack/react-query';
import { memorizationProgramEntityTypesService } from '../services/memorizationProgramEntityTypes.service';
import { API_KEYS } from '../endpoints';
import useCustomQuery from '../../utils/hooks/global/useCustomQuery';
import useCustomMutation from '../../utils/hooks/global/useCustomMutation';

export const useMemorizationProgramEntityTypesQuery = params => {
    return useCustomQuery({
        queryKey: [API_KEYS.MEMORIZATION_PROGRAM_ENTITY_TYPES, params],
        queryFn: () =>
            memorizationProgramEntityTypesService.getMemorizationProgramEntityTypes(
                params
            )
    });
};

export const useMemorizationProgramEntityTypeQuery = id => {
    return useCustomQuery({
        queryKey: [API_KEYS.MEMORIZATION_PROGRAM_ENTITY_TYPES, id],
        queryFn: () =>
            memorizationProgramEntityTypesService.getMemorizationProgramEntityType(
                id
            )
    });
};

export const useCreateMemorizationProgramEntityTypeMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data =>
            memorizationProgramEntityTypesService.createMemorizationProgramEntityType(
                data
            ),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.MEMORIZATION_PROGRAM_ENTITY_TYPES]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useUpdateMemorizationProgramEntityTypeMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data =>
            memorizationProgramEntityTypesService.updateMemorizationProgramEntityType(
                data.id,
                data
            ),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.MEMORIZATION_PROGRAM_ENTITY_TYPES]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useDeleteMemorizationProgramEntityTypeMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: id =>
            memorizationProgramEntityTypesService.deleteMemorizationProgramEntityType(
                id
            ),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.MEMORIZATION_PROGRAM_ENTITY_TYPES]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};
