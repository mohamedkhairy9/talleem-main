import useCustomQuery from '../../utils/hooks/global/useCustomQuery';
import useCustomMutation from '../../utils/hooks/global/useCustomMutation';
import { importErrorsService } from '../services/importErrors.service';
import { API_KEYS } from '../endpoints';
import { useQueryClient } from '@tanstack/react-query';

export const useImportErrorsQuery = (
    params = {},
    options = {
        enabled: true,
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000
    }
) => {
    return useCustomQuery({
        queryKey: [API_KEYS.IMPORT_ERRORS, params],
        queryFn: () => importErrorsService.getImportErrors(params),
        ...options
    });
};

export const useClearImportErrorsMutation = () => {
    const queryClient = useQueryClient();
    
    return useCustomMutation({
        mutationFn: () => importErrorsService.clearImportErrors(),
        onSuccess: () => {
            queryClient.invalidateQueries([API_KEYS.IMPORT_ERRORS]);
        }
    });
};

