import assert from 'node:assert/strict';
import {
    getRequiredParamKeysForField,
    getServiceParamsForField
} from './asyncSelectParamRules.js';

assert.deepEqual(
    getRequiredParamKeysForField('student_id', { status: true }),
    ['entity_id'],
    'Student dropdowns should remain entity-scoped by default'
);

assert.equal(
    getRequiredParamKeysForField('student_id', { status: true, skipRequiredParams: true }),
    null,
    'Parent assignment can explicitly load students without an entity filter'
);

assert.deepEqual(
    getServiceParamsForField({ status: true, skipRequiredParams: true }),
    { status: true },
    'UI-only async select flags must not be sent to the backend API'
);
