import { useQueryClient } from '@tanstack/react-query';
import { branchAdministrationsService } from '../services/branchAdministrations.service';
import { API_KEYS } from '../endpoints';
import useCustomQuery from '../../utils/hooks/global/useCustomQuery';
import useCustomMutation from '../../utils/hooks/global/useCustomMutation';

export const useBranchAdministrationsQuery = (params = {}, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.BRANCH_ADMINISTRATIONS, params],
        queryFn: () =>
            branchAdministrationsService.getBranchAdministrations(params),
        ...options
    });
};

export const useBranchAdministrationQuery = (id, options = {}) => {
    return useCustomQuery({
        queryKey: [API_KEYS.BRANCH_ADMINISTRATIONS, id],
        queryFn: () => branchAdministrationsService.getBranchAdministration(id),
        ...options
    });
};

export const useCreateBranchAdministrationMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data =>
            branchAdministrationsService.createBranchAdministration(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.BRANCH_ADMINISTRATIONS]
            });
        }
    });
};

export const useUpdateBranchAdministrationMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data =>
            branchAdministrationsService.updateBranchAdministration(
                data.id,
                data
            ),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.BRANCH_ADMINISTRATIONS]
            });
        }
    });
};

export const useDeleteBranchAdministrationMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: id =>
            branchAdministrationsService.deleteBranchAdministration(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [API_KEYS.BRANCH_ADMINISTRATIONS]
            });
        }
    });
};
