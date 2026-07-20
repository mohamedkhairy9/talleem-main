import assert from 'node:assert/strict';
import { canChangeEntityStatus } from './entityStatusPolicy.js';

assert.equal(
    canChangeEntityStatus({
        currentStatus: 'suspended',
        nextStatus: 'active',
        isSuperAdmin: true
    }),
    true,
    'super admins can activate suspended entities'
);

assert.equal(
    canChangeEntityStatus({
        currentStatus: 'suspended',
        nextStatus: 'canceled',
        isSuperAdmin: true
    }),
    false,
    'super admins cannot change suspended entities to any status other than active'
);

assert.equal(
    canChangeEntityStatus({
        currentStatus: 'active',
        nextStatus: 'suspended',
        isSuperAdmin: true
    }),
    false,
    'super admins cannot change an active entity status'
);
