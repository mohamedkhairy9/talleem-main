/**
 * Roles excluded from user/employee assignment pickers (by API `name`).
 */
const EXCLUDED_ROLE_NAMES = new Set(['teacher', 'entity manager', 'student', 'parent']);

export function normalizeRoleName(name) {
    return (name ?? '').toString().trim().toLowerCase();
}

export function isAssignableRole(role) {
    if (!role || role.name == null) return true;
    return !EXCLUDED_ROLE_NAMES.has(normalizeRoleName(role.name));
}

export function filterAssignableRoles(roles) {
    if (!Array.isArray(roles)) return [];
    return roles.filter(isAssignableRole);
}
