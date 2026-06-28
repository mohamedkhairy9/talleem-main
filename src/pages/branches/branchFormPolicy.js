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

export function normalizeBranchCityValue(branch) {
    if (!branch) return [];

    if (Array.isArray(branch.city_ids) && branch.city_ids.length > 0) {
        return normalizeSelectedIds(branch.city_ids);
    }

    if (Array.isArray(branch.cities) && branch.cities.length > 0) {
        return normalizeSelectedIds(branch.cities);
    }

    if (branch.city_id !== undefined && branch.city_id !== null && branch.city_id !== '') {
        return normalizeSelectedIds(branch.city_id);
    }

    if (branch.city) {
        return normalizeSelectedIds(branch.city);
    }

    return [];
}

export function buildBranchSubmissionPayload(data) {
    const cityIds = normalizeSelectedIds(data.city_id);

    const payload = {
        ...data
    };

    delete payload.neighborhood_id;

    if (cityIds.length > 0) {
        payload.city_id = cityIds[0];
        payload.city_ids = cityIds;
    } else {
        delete payload.city_id;
        delete payload.city_ids;
    }

    return payload;
}
