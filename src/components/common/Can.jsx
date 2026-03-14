import { useUserStore } from '@/utils/stores/user.store';

/**
 * Renders children if the user has the required permission; otherwise renders fallback.
 * Super_admin always sees children.
 *
 * @param {Object} props
 * @param {string} [props.resource] - Backend resource name (e.g. 'users', 'entities')
 * @param {string} [props.action] - Action code (e.g. 'r', 'c', 'u', 'd', 'ex', 'im', 'as', 're', 'st', 'pl'). Default 'r'
 * @param {string} [props.permission] - Alternative: "resource.action" string
 * @param {Array<{resource: string, action: string}>} [props.any] - User needs ANY of these
 * @param {Array<{resource: string, action: string}>} [props.all] - User needs ALL of these
 * @param {React.ReactNode} [props.fallback] - Rendered when permission check fails
 * @param {React.ReactNode} props.children
 */
export default function Can({
    resource,
    action = 'r',
    permission,
    any: anyChecks,
    all: allChecks,
    fallback = null,
    children,
}) {
    const can = useUserStore(state => state.can);
    const canAny = useUserStore(state => state.canAny);
    const canAll = useUserStore(state => state.canAll);
    const hasPermission = useUserStore(state => state.hasPermission);

    let allowed = false;

    if (permission != null) {
        if (typeof permission === 'string' && permission.includes('.')) {
            const [r, a] = permission.split('.');
            allowed = can(r?.trim(), a?.trim());
        } else {
            allowed = hasPermission(permission);
        }
    } else if (resource != null) {
        allowed = can(resource, action);
    } else if (anyChecks?.length) {
        allowed = canAny(anyChecks);
    } else if (allChecks?.length) {
        allowed = canAll(allChecks);
    }

    return allowed ? children : fallback;
}

/**
 * Inverse of Can: render children when user does NOT have the permission.
 */
export function Cannot({ resource, action = 'r', permission, fallback = null, children }) {
    const can = useUserStore(state => state.can);
    const hasPermission = useUserStore(state => state.hasPermission);

    let has = false;
    if (permission != null) {
        has = typeof permission === 'string' && permission.includes('.')
            ? (() => { const [r, a] = permission.split('.'); return can(r?.trim(), a?.trim()); })()
            : hasPermission(permission);
    } else if (resource != null) {
        has = can(resource, action);
    }

    return !has ? children : fallback;
}
