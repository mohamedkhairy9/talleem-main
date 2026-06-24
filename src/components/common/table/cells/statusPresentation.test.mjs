import assert from 'node:assert/strict';
import { getStatusPresentation } from './statusPresentation.js';

assert.equal(
    getStatusPresentation('Unlicensed').label,
    'Unlicensed',
    'unlicensed API status should render as Unlicensed'
);

assert.match(
    getStatusPresentation('Unlicensed').className,
    /amber/,
    'unlicensed API status should not reuse the enabled/active color'
);

assert.equal(
    getStatusPresentation(true).labelKey,
    'common.enabled',
    'boolean true should keep the existing enabled label'
);

assert.equal(
    getStatusPresentation('active').labelKey,
    'common.active',
    'active string should render as Active, not generic Enabled'
);
