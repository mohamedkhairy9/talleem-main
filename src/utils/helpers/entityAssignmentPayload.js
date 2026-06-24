const hasEntityValue = value => value !== null && value !== undefined && value !== '';

const normalizeEntityIds = value => {
    const values = Array.isArray(value) ? value : [value];
    return values.filter(hasEntityValue);
};

export function withEntityAssignmentPayload(data) {
    const payload = { ...data };
    const entityIds = normalizeEntityIds(payload.entity_ids);

    if (entityIds.length > 0) {
        payload.entity_ids = entityIds;

        if (!hasEntityValue(payload.entity_id)) {
            payload.entity_id = entityIds[0];
        }

        return payload;
    }

    if (hasEntityValue(payload.entity_id)) {
        payload.entity_ids = [payload.entity_id];
    }

    return payload;
}
