import { useQueryClient } from '@tanstack/react-query';
import { entitiesService } from '../services/entities.service';
import { API_KEYS } from '../endpoints';
import useCustomQuery from '../../utils/hooks/global/useCustomQuery';
import useCustomMutation from '../../utils/hooks/global/useCustomMutation';
import { prepareFormData } from '@/utils/helpers/global.fns';

export const useEntitiesQuery = (params = {}, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.ENTITIES, params],
        queryFn: () => entitiesService.getEntities(params),
        ...options
    });
};

export const useEntityQuery = (id, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.ENTITIES, id],
        queryFn: () => entitiesService.getEntity(id),
        ...options
    });
};

export const useUnlicensedEntitiesQuery = (params = {}, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.LICENSES, 'unlicensed-entities', params],
        queryFn: () => entitiesService.getUnlicensedEntities(params),
        ...options
    });
};

export const usePendingEntityLicensesQuery = (params = {}, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.ENTITY_LICENSES, params],
        queryFn: () => entitiesService.getPendingEntityLicenses(params),
        ...options
    });
};

export const useCreateEntityMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data => entitiesService.createEntity(prepareFormData(data)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [API_KEYS.ENTITIES] });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useUpdateEntityMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data =>
            entitiesService.updateEntity(data.id, prepareFormData(data)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [API_KEYS.ENTITIES] });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useDeleteEntityMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: id => entitiesService.deleteEntity(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [API_KEYS.ENTITIES] });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useIssueEntityLicenseMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: ({ entityId, data }) =>
            entitiesService.issueEntityLicense(entityId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [API_KEYS.ENTITIES] });
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.ENTITY_LICENSES]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useRenewEntityLicenseMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: ({ entityId, data }) =>
            entitiesService.renewEntityLicense(entityId, data),
        showErrorToast: false,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [API_KEYS.ENTITIES] });
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.ENTITY_LICENSES]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useUpdateEntityLicenseActivitiesMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: ({ entityId, data }) =>
            entitiesService.updateEntityLicenseActivities(entityId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [API_KEYS.ENTITIES] });
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.ENTITY_LICENSES]
            });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useImportEntitiesMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data => entitiesService.importEntities(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [API_KEYS.ENTITIES] });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useExportExampleFileMutation = () => {
    return useCustomMutation({
        mutationFn: () => entitiesService.exportExampleFile(),
        onError: error => {
            console.log(error);
        }
    });
};
