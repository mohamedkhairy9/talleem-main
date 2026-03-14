import { useCallback } from 'react';
import { useUserStore } from '../../stores/user.store';

/**
 * Hook for permission checks. Use for conditional UI or logic.
 * @returns {{ can: (resource, action) => boolean, canAny: (checks) => boolean, canAll: (checks) => boolean, hasPermission: (permission) => boolean }}
 */
export function usePermission() {
    const can = useUserStore(state => state.can);
    const canAny = useUserStore(state => state.canAny);
    const canAll = useUserStore(state => state.canAll);
    const hasPermission = useUserStore(state => state.hasPermission);

    return {
        can: useCallback((resource, action) => can(resource, action), [can]),
        canAny: useCallback(checks => canAny(checks), [canAny]),
        canAll: useCallback(checks => canAll(checks), [canAll]),
        hasPermission: useCallback(perm => hasPermission(perm), [hasPermission]),
    };
}
