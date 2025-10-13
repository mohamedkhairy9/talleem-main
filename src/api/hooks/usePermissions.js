import { permissionsService } from '../services/permissions.service';
import { API_KEYS } from '../endpoints';
import useCustomQuery from '../../utils/hooks/global/useCustomQuery';

export const usePermissionsQuery = params => {
    return useCustomQuery({
        queryKey: [API_KEYS.PERMISSIONS, params],
        queryFn: () => permissionsService.getPermissions(params)
    });
};

export const usePermissionQuery = id => {
    return useCustomQuery({
        queryKey: [API_KEYS.PERMISSIONS, id],
        queryFn: () => permissionsService.getPermission(id)
    });
};
