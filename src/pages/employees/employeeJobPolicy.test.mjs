import assert from 'node:assert/strict';
import {
    buildEmployeeSubmissionPayload,
    filterEmployeeRoleOptions,
    getEmployeeJobPolicyState,
    getRoleSubmissionName
} from './employeeJobPolicy.js';

const roles = [
    { id: 1, name: { en: 'Supervisor', ar: 'Supervisor' } },
    { id: 2, name: { en: 'Branch Manager', ar: 'Branch Manager' } },
    { id: 3, name: { en: 'CEO', ar: 'CEO' } },
    { id: 4, name: { en: 'Student', ar: 'Student' } },
    { id: 5, name: { en: 'Teacher', ar: 'Teacher' } },
    { id: 6, name: { en: 'Entity Manager', ar: 'Entity Manager' } },
    { id: 7, name: { en: 'Parent', ar: 'Parent' } }
];

const rolesWithSuperAdmin = [
    ...roles,
    {
        id: 8,
        name: 'super admin',
        display_name: { en: 'Super Admin', ar: '\u0645\u0634\u0631\u0641 \u0639\u0627\u0645' }
    }
];

const backendRoles = [
    { id: 1, name: 'supervisor', display_name: { en: 'Supervisor' } },
    { id: 2, name: 'branch manager', display_name: { en: 'Branch Manager' } },
    { id: 3, name: 'ceo', display_name: { en: 'CEO' } },
    { id: 4, name: 'student', display_name: { en: 'Student' } },
    { id: 5, name: 'teacher', display_name: { en: 'Teacher' } },
    { id: 6, name: 'entity manager', display_name: { en: 'Entity Manager' } },
    { id: 7, name: 'parent', display_name: { en: 'Parent' } }
];

assert.deepEqual(
    filterEmployeeRoleOptions(roles).map(role => role.name.en),
    ['Supervisor', 'Branch Manager', 'CEO'],
    'employees role options exclude student, teacher, entity manager, and parent roles'
);

assert.deepEqual(
    filterEmployeeRoleOptions(backendRoles).map(role => role.name),
    ['supervisor', 'branch manager', 'ceo'],
    'employees role options match backend role resource shape'
);

assert.deepEqual(
    getEmployeeJobPolicyState({
        jobId: 10,
        jobs: [{ id: 10, name: { en: 'Supervisor' } }],
        roles
    }),
    {
        policy: 'supervisor',
        forcedRoleIds: [1],
        forceRoles: true,
        isSupervisorJob: true,
        isBranchManagerJob: false,
        isCeoJob: false,
        isMultiBranchJob: true
    },
    'supervisor job forces supervisor role and allows multiple branches'
);

assert.deepEqual(
    getEmployeeJobPolicyState({
        jobId: 10,
        jobs: [{ id: 10, name: { en: 'Supervisor' } }],
        roles: rolesWithSuperAdmin
    }).forcedRoleIds,
    [1],
    'supervisor job must not force super admin even if its display label contains supervisor words'
);

assert.equal(
    getEmployeeJobPolicyState({
        jobId: 11,
        jobs: [{ id: 11, name: { en: 'CEO' } }],
        roles
    }).isCeoJob,
    true,
    'CEO job is detected for branch restriction'
);

assert.deepEqual(
    getEmployeeJobPolicyState({
        jobId: 11,
        jobs: [{ id: 11, name: { en: 'CEO' } }],
        roles: backendRoles
    }).forcedRoleIds,
    [3],
    'CEO job forces the backend ceo role'
);

assert.equal(
    getEmployeeJobPolicyState({
        jobId: 12,
        jobs: [{ id: 12, name: { en: 'Branch Manager' } }],
        roles
    }).isMultiBranchJob,
    true,
    'branch manager job allows multiple branches'
);

assert.deepEqual(
    getEmployeeJobPolicyState({
        jobId: 12,
        jobs: [{ id: 12, name: { en: 'Branch Manager' } }],
        roles: backendRoles
    }).forcedRoleIds,
    [2],
    'branch manager job forces the backend branch manager role'
);

assert.equal(
    getRoleSubmissionName({ name: { en: 'Supervisor', ar: 'Supervisor AR' } }),
    'Supervisor',
    'localized role names submit as a stable scalar role name'
);

assert.deepEqual(
    buildEmployeeSubmissionPayload(
        {
            branch_id: [2, 3],
            entity_id: [7, 8],
            roles: [1],
            status: true
        },
        roles
    ),
    {
        branch_id: 2,
        branch_ids: [2, 3],
        entity_id: 7,
        entity_ids: [7, 8],
        roles: ['Supervisor'],
        status: 1
    },
    'multi branch/entity UI values submit using backend branch_ids/entity_ids contract'
);

assert.deepEqual(
    buildEmployeeSubmissionPayload(
        {
            branch_id: [2],
            entity_id: [7],
            roles: [1],
            status: true
        },
        [{ id: 1, name: 'supervisor', display_name: { en: 'Supervisor' } }]
    ).roles,
    ['supervisor'],
    'canonical backend role name is preferred over display label'
);

assert.deepEqual(
    buildEmployeeSubmissionPayload(
        {
            branch_id: null,
            entity_id: [],
            roles: [3],
            status: false
        },
        roles
    ),
    {
        roles: ['CEO'],
        status: 0
    },
    'CEO-style empty branch/entity values are omitted from backend payload'
);

console.log('employee job policy tests passed');
