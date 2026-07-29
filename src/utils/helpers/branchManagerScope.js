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

const getNormalizedRoles = user => {
    const roles = Array.isArray(user?.roles) ? user.roles : [];
    return roles.map(normalizeRole).filter(Boolean);
};

export const isBranchManagerScopedUser = user => {
    const normalizedRoles = getNormalizedRoles(user);
    const isBranchManager = normalizedRoles.includes(
        normalizeRole(ROLE_BRANCH_ADMIN)
    );
    const hasUnrestrictedRole =
        normalizedRoles.includes(normalizeRole(ROLE_SUPER_ADMIN)) ||
        normalizedRoles.some(role => GENERAL_MANAGER_ROLES.has(role));

    return isBranchManager && !hasUnrestrictedRole;
};

export const getBranchManagerAssignedBranchId = user => {
    if (!isBranchManagerScopedUser(user)) return null;

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

const collectBranchIds = value => {
    if (value === null || value === undefined || value === '') return [];

    if (Array.isArray(value)) {
        return value.flatMap(collectBranchIds);
    }

    const id = getId(value);
    return id === null || id === undefined || id === '' ? [] : [id];
};

/**
 * Returns every branch that can be resolved from a profile record.  Profiles
 * may expose the branch directly, through their user, or through an assigned
 * entity, depending on the endpoint that supplied the row.
 */
export const getProfileBranchIds = profile => {
    if (!profile || typeof profile !== 'object') return [];

    const directBranches = [
        profile.branch_id,
        profile.branch,
        profile.branches,
        profile.branch_ids,
        profile.user?.branch_id,
        profile.user?.branch,
        profile.user?.branches,
        profile.user?.branch_ids
    ];

    const entityBranches = [profile.entity, ...(profile.entities || [])].flatMap(
        entity =>
            entity && typeof entity === 'object'
                ? collectBranchIds([
                      entity.branch_id,
                      entity.branch,
                      entity.branches,
                      entity.branch_ids
                  ])
                : []
    );

    return [...new Set([...collectBranchIds(directBranches), ...entityBranches])];
};

export const isProfileInBranch = (profile, branchId) => {
    if (branchId === null || branchId === undefined || branchId === '') {
        return false;
    }

    const normalizedBranchId = String(branchId);
    return getProfileBranchIds(profile).some(
        profileBranchId => String(profileBranchId) === normalizedBranchId
    );
};

export const filterProfilesByBranch = (profiles, branchId) =>
    Array.isArray(profiles)
        ? profiles.filter(profile => isProfileInBranch(profile, branchId))
        : [];
