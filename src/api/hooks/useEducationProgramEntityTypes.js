import { useQueryClient } from '@tanstack/react-query';
import { educationProgramEntityTypesService } from '../services/educationProgramEntityTypes.service';
import { API_KEYS } from '../endpoints';
import useCustomQuery from '../../utils/hooks/global/useCustomQuery';
import useCustomMutation from '../../utils/hooks/global/useCustomMutation';

export const useEducationProgramEntityTypesQuery = (params = {}, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.EDUCATION_PROGRAM_ENTITY_TYPES, params],
        queryFn: () =>
            educationProgramEntityTypesService.getEducationProgramEntityTypes(
                params
            ),
        ...options
    });
};

export const useEducationProgramEntityTypeQuery = (id, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.EDUCATION_PROGRAM_ENTITY_TYPES, id],
        queryFn: () =>
            educationProgramEntityTypesService.getEducationProgramEntityType(id),
        ...options
    });
};

export const useCreateEducationProgramEntityTypeMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data =>
            educationProgramEntityTypesService.createEducationProgramEntityType(
                data
            ),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.EDUCATION_PROGRAM_ENTITY_TYPES]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useUpdateEducationProgramEntityTypeMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data =>
            educationProgramEntityTypesService.updateEducationProgramEntityType(
                data.id,
                data
            ),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.EDUCATION_PROGRAM_ENTITY_TYPES]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useDeleteEducationProgramEntityTypeMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: id =>
            educationProgramEntityTypesService.deleteEducationProgramEntityType(
                id
            ),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.EDUCATION_PROGRAM_ENTITY_TYPES]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};
