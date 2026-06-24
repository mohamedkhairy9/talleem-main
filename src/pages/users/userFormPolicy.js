import { filterAssignableRoles } from '../../utils/helpers/assignableRoles.js';

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

export function buildUserSubmissionPayload(data, oldData = {}) {
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
