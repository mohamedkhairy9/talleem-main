import { normalizeSelectedIds } from './userFormPolicy';

/**
 * The users list is intentionally lightweight and does not include all of a
 * user's assignments. The details endpoint does, so prefer it when opening a
 * user form and keep the list item only as a fallback while it loads.
 */
export function mergeUserFormData(listUser = {}, detailsResponse) {
    const details = detailsResponse?.data ?? detailsResponse;

    if (!details?.id) {
        return listUser;
    }

    const branches = Array.isArray(details.branches)
        ? details.branches
        : listUser.branches ?? [];
    const entities = Array.isArray(details.entities)
        ? details.entities
        : listUser.entities ?? [];

    return {
        ...listUser,
        ...details,
        branch_id: normalizeSelectedIds(
            details.branch_ids ?? details.branch_id ?? branches ?? details.branch
        ),
        entity_id: normalizeSelectedIds(
            details.entity_ids ?? details.entity_id ?? entities ?? details.entity
        ),
        branches,
        entities,
        branch: details.branch?.id ? details.branch : branches[0] ?? listUser.branch,
        entity: details.entity?.id ? details.entity : entities[0] ?? listUser.entity
    };
}
