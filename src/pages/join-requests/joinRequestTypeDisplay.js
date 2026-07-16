const FALLBACK_IDS = {
    entities: [3, 10, 11, 12, 13],
    teachers: [1, 7, 8, 9],
    supervisors: [2, 4, 5, 6]
};

// These two request types are managed outside Educational Supervisor Requests.
const HIDDEN_SUPERVISOR_REQUEST_TYPE_IDS = new Set([2, 4]);

const isVisibleForCategory = (requestTypeId, category) =>
    category !== 'supervisors' ||
    !HIDDEN_SUPERVISOR_REQUEST_TYPE_IDS.has(Number(requestTypeId));

export function normalizeRequestTypeText(value) {
    return String(value ?? '')
        .trim()
        .toLowerCase()
        .replace(/[أإآ]/g, 'ا')
        .replace(/ؤ/g, 'و')
        .replace(/ئ/g, 'ي')
        .replace(/ة/g, 'ه')
        .replace(/ى/g, 'ي')
        .replace(/[_-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function uniqueById(items) {
    const seen = new Set();
    return items.filter(item => {
        const id = Number(item?.id);
        if (!id || seen.has(id)) return false;
        seen.add(id);
        return true;
    });
}

export function getLocalizedRequestTypeName(requestType, locale = 'en') {
    const rawName = requestType?.name;
    if (typeof rawName === 'string') return rawName;
    return rawName?.[locale] || rawName?.en || rawName?.ar || '';
}

export function getRequestTypeTexts(requestType) {
    const rawName = requestType?.name;
    const values =
        typeof rawName === 'object'
            ? [rawName?.en, rawName?.ar]
            : [rawName];

    return [...new Set(values.map(normalizeRequestTypeText).filter(Boolean))];
}

export function resolveRequestTypeCategory(requestType) {
    const texts = getRequestTypeTexts(requestType);

    if (
        texts.some(
            text => text.includes('teacher') || text.includes('معلم') || text.includes('مدرس')
        )
    ) {
        return 'teachers';
    }

    if (texts.some(text => text.includes('student') || text.includes('طالب'))) {
        return 'supervisors';
    }

    if (texts.some(text => text.includes('entity') || text.includes('جهه') || text.includes('جهة'))) {
        return 'entities';
    }

    return null;
}

export function collectRequestTypesFromJoinRequests(joinRequests = []) {
    return uniqueById(
        joinRequests
            .map(request => {
                const requestType = request?.request_type;
                const id = Number(requestType?.id ?? request?.request_type_id);
                if (!id) return null;
                return {
                    id,
                    name: requestType?.name
                };
            })
            .filter(item => item?.name)
    );
}

export function getRequestTypeIdsByCategory(requestTypesData, category, joinRequests = []) {
    if (!category) return [];

    const requestTypes = requestTypesData?.data?.length
        ? requestTypesData.data
        : collectRequestTypesFromJoinRequests(joinRequests);

    if (requestTypes.length) {
        const matchingIds = requestTypes
            .filter(requestType => resolveRequestTypeCategory(requestType) === category)
            .map(requestType => requestType.id);

        const visibleIds = matchingIds.filter(requestTypeId =>
            isVisibleForCategory(requestTypeId, category)
        );

        if (visibleIds.length > 0) {
            return visibleIds;
        }
    }

    return (FALLBACK_IDS[category] || []).filter(requestTypeId =>
        isVisibleForCategory(requestTypeId, category)
    );
}

export function getRequestTypesForCategory(
    requestTypesData,
    category,
    requestTypeIds,
    joinRequests = [],
    locale = 'en'
) {
    if (!category || requestTypeIds.length === 0) return [];

    const visibleRequestTypeIds = requestTypeIds.filter(requestTypeId =>
        isVisibleForCategory(requestTypeId, category)
    );

    if (visibleRequestTypeIds.length === 0) return [];

    const requestTypes = requestTypesData?.data?.length
        ? requestTypesData.data
        : collectRequestTypesFromJoinRequests(joinRequests);

    if (requestTypes.length) {
        const idSet = new Set(visibleRequestTypeIds.map(Number));
        const matchingTypes = requestTypes
            .filter(type => idSet.has(Number(type.id)))
            .map(type => ({
                id: type.id,
                name: getLocalizedRequestTypeName(type, locale) || `Request Type ${type.id}`
            }));

        if (matchingTypes.length > 0) {
            return matchingTypes;
        }
    }

    return visibleRequestTypeIds.map(id => ({ id, name: `Request Type ${id}` }));
}

export function buildRequestTypesMap(categoryRequestTypes = [], joinRequests = [], locale = 'en', requestTypesData = null) {
    const map = {};

    categoryRequestTypes.forEach(type => {
        if (type?.id && type?.name) map[type.id] = type.name;
    });

    collectRequestTypesFromJoinRequests(joinRequests).forEach(type => {
        const name = getLocalizedRequestTypeName(type, locale);
        if (name) map[type.id] = name;
    });

    requestTypesData?.data?.forEach(type => {
        const name = getLocalizedRequestTypeName(type, locale);
        if (name) map[type.id] = name;
    });

    return map;
}
