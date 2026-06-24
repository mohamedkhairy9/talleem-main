import assert from 'node:assert/strict';
import { withEntityAssignmentPayload } from './entityAssignmentPayload.js';

assert.deepEqual(
    withEntityAssignmentPayload({ entity_id: 9, name: 'Teacher' }),
    { entity_id: 9, entity_ids: [9], name: 'Teacher' },
    'single entity_id should be mirrored to entity_ids for assignment sync'
);

assert.deepEqual(
    withEntityAssignmentPayload({ entity_ids: [3, 4], name: 'Student' }),
    { entity_id: 3, entity_ids: [3, 4], name: 'Student' },
    'entity_ids should provide the primary entity_id when it is missing'
);

assert.deepEqual(
    withEntityAssignmentPayload({ entity_id: 7, entity_ids: [2, 7] }),
    { entity_id: 7, entity_ids: [2, 7] },
    'an explicit primary entity_id should not be replaced by entity_ids'
);

assert.deepEqual(
    withEntityAssignmentPayload({ entity_id: '', entity_ids: ['', null, undefined] }),
    { entity_id: '', entity_ids: ['', null, undefined] },
    'empty entity values should not create an assignment payload'
);

console.log('entity assignment payload tests passed');
