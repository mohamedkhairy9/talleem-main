import assert from 'node:assert/strict';
import { teacherReadonlyStatusOptions } from './teacherStatusOptions.js';
import { teacherStatusOptions } from '../../utils/constants/options.js';

assert.equal(
    teacherReadonlyStatusOptions.some(option => option.value === 'unlicensed'),
    true,
    'teacher view/edit status options should include unlicensed'
);

assert.equal(
    teacherStatusOptions.some(option => option.value === 'unlicensed'),
    false,
    'create/edit submission status options should not be mutated to include unlicensed'
);
