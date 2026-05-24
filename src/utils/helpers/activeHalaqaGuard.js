const ACTIVE_COUNT_KEYS = [
    'active_halaqas_count',
    'active_halaqa_count',
    'current_halaqas_count',
    'current_halaqa_count',
    'ongoing_halaqas_count',
    'ongoing_halaqa_count',
    'active_sessions_count',
    'current_sessions_count'
];

const ACTIVE_ARRAY_KEYS = [
    'active_halaqas',
    'active_halaqa',
    'current_halaqas',
    'current_halaqa',
    'ongoing_halaqas',
    'ongoing_halaqa',
    'active_sessions',
    'current_sessions'
];

const POSSIBLE_HALAQA_ARRAY_KEYS = ['halaqas', 'sessions'];

const ACTIVE_STATUS_TOKENS = ['active', 'ongoing', 'current', 'running', 'in_progress'];

const toNumber = value => {
    if (typeof value === 'number' && Number.isFinite(value)) {
        return value;
    }

    if (typeof value === 'string' && value.trim() !== '') {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : null;
    }

    return null;
};

const normalizeRelationId = value => {
    if (value == null || value === '') return null;
    if (typeof value === 'object') {
        return normalizeRelationId(value.id ?? value.value ?? null);
    }

    const numericValue = toNumber(value);
    return numericValue ?? value;
};

const isStatusActive = value => {
    if (typeof value === 'boolean') return value;

    const numericValue = toNumber(value);
    if (numericValue !== null) {
        return numericValue === 1;
    }

    if (typeof value === 'string') {
        const normalized = value.trim().toLowerCase();
        return ACTIVE_STATUS_TOKENS.some(token => normalized.includes(token));
    }

    return false;
};

const isActiveHalaqaItem = item => {
    if (!item || typeof item !== 'object') {
        return false;
    }

    if (isStatusActive(item.is_active) || isStatusActive(item.active)) {
        return true;
    }

    return [item.status, item.status_text, item.state, item.stage]
        .some(isStatusActive);
};

const countArrayItems = (items, strict = false) => {
    if (!Array.isArray(items) || items.length === 0) {
        return 0;
    }

    if (strict) {
        return items.filter(isActiveHalaqaItem).length;
    }

    return items.length;
};

export const getActiveHalaqaInfo = record => {
    if (!record || typeof record !== 'object') {
        return {
            hasActiveHalaqas: false,
            activeHalaqasCount: 0,
            source: null
        };
    }

    for (const key of ACTIVE_COUNT_KEYS) {
        const count = toNumber(record[key]);
        if ((count ?? 0) > 0) {
            return {
                hasActiveHalaqas: true,
                activeHalaqasCount: count,
                source: key
            };
        }
    }

    for (const key of ACTIVE_ARRAY_KEYS) {
        const count = countArrayItems(record[key]);
        if (count > 0) {
            return {
                hasActiveHalaqas: true,
                activeHalaqasCount: count,
                source: key
            };
        }
    }

    for (const key of POSSIBLE_HALAQA_ARRAY_KEYS) {
        const count = countArrayItems(record[key], true);
        if (count > 0) {
            return {
                hasActiveHalaqas: true,
                activeHalaqasCount: count,
                source: key
            };
        }
    }

    return {
        hasActiveHalaqas: false,
        activeHalaqasCount: 0,
        source: null
    };
};

export const isMemorizationProgramSelected = (currentMainProgramId, originalMainProgramId) =>
    Number(currentMainProgramId ?? originalMainProgramId) === 2 ||
    Number(originalMainProgramId) === 2;

export const getOriginalMemorizationSegmentationId = oldData =>
    normalizeRelationId(
        oldData?.memorization_program_entity_type_id ??
        oldData?.memorization_program_entity_type ??
        oldData?.entity_category_id
    );

export const hasSegmentationAffectingChange = ({
    oldData,
    currentMainProgramId,
    currentBranchId,
    currentEntityId,
    currentEntityCategoryId
}) => {
    if (!oldData) return false;

    const originalMainProgramId = normalizeRelationId(oldData.main_program_id);
    const nextMainProgramId = normalizeRelationId(currentMainProgramId ?? originalMainProgramId);

    if (!isMemorizationProgramSelected(nextMainProgramId, originalMainProgramId)) {
        return false;
    }

    return (
        normalizeRelationId(currentBranchId ?? oldData.branch_id) !== normalizeRelationId(oldData.branch_id) ||
        normalizeRelationId(currentEntityId ?? oldData.entity_id) !== normalizeRelationId(oldData.entity_id) ||
        nextMainProgramId !== originalMainProgramId ||
        normalizeRelationId(currentEntityCategoryId) !== getOriginalMemorizationSegmentationId(oldData)
    );
};
