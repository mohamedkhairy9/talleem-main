import assert from 'node:assert/strict';
import { normalizeEntityListParams } from './entityListParams.js';

assert.deepEqual(
    normalizeEntityListParams({ status: 'active', search: '' }),
    { search: '' },
    'active entity list should use backend default filtering so unlicensed entities stay hidden'
);

assert.deepEqual(
    normalizeEntityListParams({ status: 'unauthorized', search: 'x' }),
    { status: 'unauthorized', search: 'x' },
    'non-active entity filters should still be sent explicitly'
);
