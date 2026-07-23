import {
    ROLE_BRANCH_ADMIN,
    ROLE_SUPER_ADMIN,
    normalizeRole
} from '@/utils/constants/configs';

const GENERAL_MANAGER_ROLES = new Set([
    normalizeRole('general manager'),
    normalizeRole('ceo'),
    normalizeRole('مدير عام'),
    normalizeRole('مدير الإدارة العامة')
]);

const getId = value => {
    if (value === null || value === undefined || value === '') return null;
    if (typeof value === 'object') {
        return value.id ?? value.branch_id ?? null;
    }
    return value;
};

const getFirstBranchId = values => {
    for (const value of values) {
        const candidates = Array.isArray(value) ? value : [value];
        for (const candidate of candidates) {
            const id = getId(candidate);
            if (id !== null && id !== undefined && id !== '') return id;
        }
    }
    return null;
};

export const getBranchManagerAssignedBranchId = user => {
    const roles = Array.isArray(user?.roles) ? user.roles : [];
    const normalizedRoles = roles.map(normalizeRole).filter(Boolean);
    const isBranchManager = normalizedRoles.includes(
        normalizeRole(ROLE_BRANCH_ADMIN)
    );
    const hasUnrestrictedRole =
        normalizedRoles.includes(normalizeRole(ROLE_SUPER_ADMIN)) ||
        normalizedRoles.some(role => GENERAL_MANAGER_ROLES.has(role));

    if (!isBranchManager || hasUnrestrictedRole) return null;

    return getFirstBranchId([
        user?.branch_id,
        user?.branch,
        user?.current_branch,
        user?.branches,
        user?.branch_ids,
        user?.profile?.branch_id,
        user?.profile?.branch,
        user?.employee?.branch_id,
        user?.employee?.branch
    ]);
};
