import assert from 'node:assert/strict';
import {
    buildUserSubmissionPayload,
    filterUserAssignableRoles,
    getUserEditPolicy,
    isUserFieldEditable,
    USER_EDIT_POLICY
} from './userFormPolicy.js';
import { getReservedSystemRole } from '../../utils/helpers/assignableRoles.js';

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

assert.equal(
    getReservedSystemRole(['super_admin', 'student']),
    'student',
    'a reserved role should be detected even when another role is also present'
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

const reservedEditPolicy = getUserEditPolicy({
    id: 10,
    roles: ['teacher']
});
assert.equal(
    reservedEditPolicy.type,
    USER_EDIT_POLICY.RESERVED,
    'teacher accounts should be recognized as reserved system profiles'
);
assert.equal(
    isUserFieldEditable('password', reservedEditPolicy),
    true,
    'reserved profiles should allow a password update'
);
assert.equal(
    isUserFieldEditable('national_id', reservedEditPolicy),
    false,
    'reserved profiles should keep profile fields read-only'
);

const employeeEditPolicy = getUserEditPolicy({
    id: 11,
    user_type: 'employee',
    employee: { id: 4 }
});
assert.equal(
    employeeEditPolicy.type,
    USER_EDIT_POLICY.EMPLOYEE,
    'employee relation should enable the employee edit policy'
);
assert.equal(
    isUserFieldEditable('role_id', employeeEditPolicy),
    true,
    'employees should be able to update assigned roles'
);
assert.equal(
    isUserFieldEditable('branch_id', employeeEditPolicy),
    false,
    'employees should keep assignment fields read-only from the Users page'
);

const superAdminEditPolicy = getUserEditPolicy({
    id: 12,
    roles: ['super_admin'],
    employee: { id: 5 }
});
assert.equal(
    superAdminEditPolicy.type,
    USER_EDIT_POLICY.REGULAR,
    'Super Admins should retain full edit access even when linked to an employee profile'
);
assert.equal(
    isUserFieldEditable('entity_id', superAdminEditPolicy),
    true,
    'Super Admins should be able to edit all user fields'
);

assert.deepEqual(
    buildUserSubmissionPayload(
        {
            id: 11,
            name: { en: 'Changed name' },
            national_id: 'changed-id',
            branch_id: [2],
            entity_id: [7],
            password: 'new-secret'
        },
        { id: 11, employee: { id: 4 } },
        { editMode: true, editPolicy: employeeEditPolicy }
    ),
    { id: 11, password: 'new-secret' },
    'restricted user updates should only submit editable fields'
);

console.log('user form policy tests passed');
