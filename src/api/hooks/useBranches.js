import { useQueryClient } from '@tanstack/react-query';
import { branchesService } from '../services/branches.service';
import { API_KEYS } from '../endpoints';
import useCustomQuery from '../../utils/hooks/global/useCustomQuery';
import useCustomMutation from '../../utils/hooks/global/useCustomMutation';

export const useBranchesQuery = params => {
    return useCustomQuery({
        queryKey: [API_KEYS.BRANCHES, params],
        queryFn: () => branchesService.getBranches(params)
    });
};

export const useBranchQuery = id => {
    return useCustomQuery({
        queryKey: [API_KEYS.BRANCHES, id],
        queryFn: () => branchesService.getBranch(id)
    });
};

export const useCreateBranchMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data => branchesService.createBranch(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [API_KEYS.BRANCHES] });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useUpdateBranchMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: data => branchesService.updateBranch(data.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [API_KEYS.BRANCHES] });
        },
        onError: error => {
            console.log(error);
        }
    });
};

export const useDeleteBranchMutation = () => {
    const queryClient = useQueryClient();
    return useCustomMutation({
        mutationFn: id => branchesService.deleteBranch(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [API_KEYS.BRANCHES] });
        },
        onError: error => {
            console.log(error);
        }
    });
};
