export const SKIP_REQUIRED_PARAMS_KEY = 'skipRequiredParams';

const REQUIRED_PARAM_KEYS_BY_FIELD = {
    entity_id: ['branch_id'],
    student_id: ['entity_id'],
    teacher_id: ['entity_id'],
    warning_reason_id: ['main_program_id']
};

function getRequiredParamConfig(fieldName) {
    return REQUIRED_PARAM_KEYS_BY_FIELD[fieldName] || null;
}

export function hasRequiredParams(fieldName, params = {}) {
    if (params[SKIP_REQUIRED_PARAMS_KEY]) {
        return true;
    }

    const requiredParamKeys = getRequiredParamConfig(fieldName);

    if (!requiredParamKeys?.length) return true;

    // Employee form can load entities for one branch or many branches.
    if (fieldName === 'entity_id') {
        const hasSingleBranch = params.branch_id !== undefined && params.branch_id !== null && params.branch_id !== '';
        const hasMultipleBranches = Array.isArray(params.branches_id) && params.branches_id.length > 0;
        return hasSingleBranch || hasMultipleBranches;
    }

    return !requiredParamKeys.some(key => {
        const value = params[key];
        return value === undefined || value === null || value === '';
    });
}

export function getRequiredParamKeysForField(fieldName, params = {}) {
    return hasRequiredParams(fieldName, params) ? null : getRequiredParamConfig(fieldName);
}

export function getServiceParamsForField(params = {}) {
    const { [SKIP_REQUIRED_PARAMS_KEY]: _skipRequiredParams, ...serviceParams } = params;

    return serviceParams;
}
