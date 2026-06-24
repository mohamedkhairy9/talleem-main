import assert from 'node:assert/strict';
import { resolveJoinRequestsListPath } from './joinRequestsRouting.js';

assert.equal(
    resolveJoinRequestsListPath({ mode: 'all', scoped: true }),
    '/join-requests/pending',
    'scoped users should use the backend scoped pending endpoint, not the unscoped all-list'
);

assert.equal(
    resolveJoinRequestsListPath({ mode: 'all', scoped: false }),
    '/join-requests',
    'super admin all-list should keep using the normal join requests endpoint'
);

assert.equal(
    resolveJoinRequestsListPath({ mode: 'pending', scoped: false }),
    '/join-requests/pending',
    'explicit pending mode should always use pending endpoint'
);

console.log('joinRequestsRouting tests passed');
