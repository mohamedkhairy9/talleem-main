import assert from 'node:assert/strict';
import {
    buildRequestTypesMap,
    getRequestTypeIdsByCategory,
    getRequestTypesForCategory
} from './joinRequestTypeDisplay.js';

const joinRequests = [
    {
        id: 101,
        request_type_id: 7,
        request_type: {
            id: 7,
            name: {
                en: 'Teacher License Renewal',
                ar: 'تجديد رخصة معلم'
            }
        }
    }
];

assert.deepEqual(
    getRequestTypeIdsByCategory(null, 'teachers', joinRequests),
    [7],
    'request type ids should be derived from returned join request names when request-types list is unavailable'
);

assert.deepEqual(
    getRequestTypesForCategory(null, 'teachers', [7], joinRequests, 'en'),
    [{ id: 7, name: 'Teacher License Renewal' }],
    'tab labels should use configured request type names from returned join requests'
);

assert.equal(
    buildRequestTypesMap([], joinRequests, 'ar')[7],
    'تجديد رخصة معلم',
    'table labels should use localized request type names from returned join requests'
);

console.log('joinRequestTypeDisplay tests passed');
