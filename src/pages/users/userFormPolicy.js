import {
    extractSearchableTexts,
    filterAssignableRoles,
    getReservedSystemRole
} from '../../utils/helpers/assignableRoles.js';

export const USER_EDIT_POLICY = {
    REGULAR: 'regular',
    EMPLOYEE: 'employee',
    RESERVED: 'reserved'
};

const RESTRICTED_EDITABLE_FIELDS = {
    [USER_EDIT_POLICY.EMPLOYEE]: ['password', 'role_id'],
    [USER_EDIT_POLICY.RESERVED]: ['password']
};

/**
 * Determines which fields can be changed from the Users page. Reserved
 * profile accounts are maintained by their own workflows. An employee is
 * identified by the employee relation returned from the user details API;
 * a regular dashboard user remains fully editable.
 */
export function getUserEditPolicy(user = {}) {
    const roleCandidates = Array.isArray(user?.roles)
        ? [...user.roles]
        : user?.roles
        ? [user.roles]
        : [];

    if (user?.user_type) {
        roleCandidates.push(user.user_type);
    }

    const isSuperAdmin = extractSearchableTexts(roleCandidates).some(
        role =>
            role.includes('super admin') ||
            role.includes('system admin') ||
            role === 'مسؤول النظام'
    );

    // Super Admins retain full user-management access even if their account
    // is linked to an employee profile.
    if (isSuperAdmin) {
        return {
            type: USER_EDIT_POLICY.REGULAR,
            reservedSystemRole: null,
            editableFields: null
        };
    }

    const reservedSystemRole = getReservedSystemRole(roleCandidates);
    if (reservedSystemRole) {
        return {
            type: USER_EDIT_POLICY.RESERVED,
            reservedSystemRole,
            editableFields: RESTRICTED_EDITABLE_FIELDS[USER_EDIT_POLICY.RESERVED]
        };
    }

    const isEmployee = Boolean(
        user?.employee &&
            typeof user.employee === 'object' &&
            user.employee.id !== undefined &&
            user.employee.id !== null
    );

    if (isEmployee) {
        return {
            type: USER_EDIT_POLICY.EMPLOYEE,
            reservedSystemRole: null,
            editableFields: RESTRICTED_EDITABLE_FIELDS[USER_EDIT_POLICY.EMPLOYEE]
        };
    }

    return {
        type: USER_EDIT_POLICY.REGULAR,
        reservedSystemRole: null,
        editableFields: null
    };
}

export function isUserFieldEditable(fieldName, editPolicy) {
    if (!editPolicy || editPolicy.type === USER_EDIT_POLICY.REGULAR) {
        return true;
    }

    return editPolicy.editableFields.includes(fieldName);
}

export function normalizeSelectedIds(value) {
    if (Array.isArray(value)) {
        return value
            .map(item => item?.id ?? item?.value ?? item)
            .filter(item => item !== undefined && item !== null && item !== '')
            .map(item => {
                const numberValue = Number(item);
                return Number.isNaN(numberValue) ? item : numberValue;
            });
    }

    if (value && typeof value === 'object') {
        const normalized = value.id ?? value.value;
        if (normalized === undefined || normalized === null || normalized === '') {
            return [];
        }

        const numberValue = Number(normalized);
        return [Number.isNaN(numberValue) ? normalized : numberValue];
    }

    if (value === undefined || value === null || value === '') {
        return [];
    }

    const numberValue = Number(value);
    return [Number.isNaN(numberValue) ? value : numberValue];
}

export function filterUserAssignableRoles(roles) {
    return filterAssignableRoles(roles);
}

export function buildUserSubmissionPayload(
    data,
    oldData = {},
    { editMode = false, editPolicy = getUserEditPolicy(oldData) } = {}
) {
    // Restricted account types are allowed to update only their explicitly
    // editable fields. Sending a minimal payload also prevents stale default
    // values from overwriting profile-managed data on the server.
    if (editMode && editPolicy.type !== USER_EDIT_POLICY.REGULAR) {
        const restrictedPayload = {
            id: data?.id ?? oldData?.id
        };

        if (data?.password) {
            restrictedPayload.password = data.password;
        }

        return restrictedPayload;
    }

    const normalizedName = data.name?.en?.trim?.() ?? '';
    const branchIds = normalizeSelectedIds(data.branch_id);
    const entityIds = normalizeSelectedIds(data.entity_id);
    const isEnabled =
        oldData?.status === 1 ||
        oldData?.status === true ||
        oldData?.status === '1';

    const payload = {
        ...data,
        name: {
            en: normalizedName,
            ar: normalizedName
        },
        locale: 'en',
        current_app_locale: 'en',
        status: isEnabled ? 1 : 0,
        user_type: oldData?.user_type || 'employee'
    };

    delete payload.branch_id;
    delete payload.entity_id;

    if (branchIds.length > 0) {
        payload.branch_id = branchIds[0];
        payload.branch_ids = branchIds;
    }

    if (entityIds.length > 0) {
        payload.entity_id = entityIds[0];
        payload.entity_ids = entityIds;
    }

    return payload;
}
