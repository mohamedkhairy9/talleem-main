import assert from 'node:assert/strict';
import {
    buildUserSubmissionPayload,
    filterUserAssignableRoles
} from './userFormPolicy.js';

const disallowedRoles = [
    { id: 1, name: 'student', display_name: { en: 'Student' } },
    { id: 2, name: 'parent', display_name: { en: 'Parent' } },
    { id: 3, name: 'teacher', display_name: { en: 'Teacher' } },
    { id: 4, name: 'entity', display_name: { en: 'Entity' } },
    { id: 5, name: 'supervisor', display_name: { en: 'Supervisor' } }
];

assert.deepEqual(
    filterUserAssignableRoles([
        ...disallowedRoles,
        { id: 6, name: 'super-admin', display_name: { en: 'Super Admin' } },
        { id: 7, name: 'branch manager', display_name: { en: 'Branch Manager' } }
    ]).map(role => role.name),
    ['super-admin', 'branch manager'],
    'users role dropdown should hide mobile-app roles only exposing dashboard roles'
);

assert.deepEqual(
    buildUserSubmissionPayload(
        {
            name: { en: 'Admin User' },
            national_id: 'admin-user-id',
            password: 'secret123',
            branch_id: [2, 3],
            entity_id: [7, 8],
            role_id: 6
        },
        { status: true, user_type: 'employee' }
    ),
    {
        name: { en: 'Admin User', ar: 'Admin User' },
        national_id: 'admin-user-id',
        password: 'secret123',
        branch_id: 2,
        branch_ids: [2, 3],
        entity_id: 7,
        entity_ids: [7, 8],
        role_id: 6,
        locale: 'en',
        current_app_locale: 'en',
        status: 1,
        user_type: 'employee'
    },
    'users form should submit multi branch/entity UI values using backend branch_ids/entity_ids contract'
);

console.log('user form policy tests passed');
