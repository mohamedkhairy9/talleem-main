import { extractSearchableTexts } from '../../utils/helpers/assignableRoles.js';

const ROLE_EXCLUSIONS = {
    student: ['student', '\u0637\u0627\u0644\u0628'],
    teacher: ['teacher', '\u0645\u0639\u0644\u0645', '\u0645\u062f\u0631\u0633'],
    parent: ['parent', '\u0648\u0644\u064a \u0627\u0645\u0631', '\u0648\u0644\u064a \u0623\u0645\u0631'],
    entityManager: [
        'entity manager',
        'entitymanager',
        '\u0645\u062f\u064a\u0631 \u062c\u0647\u0629',
        '\u0645\u062f\u064a\u0631 \u0643\u064a\u0627\u0646',
        '\u0645\u0633\u0624\u0648\u0644 \u062c\u0647\u0629'
    ]
};

const JOB_POLICY_ALIASES = {
    supervisor: ['supervisor', '\u0645\u0634\u0631\u0641'],
    branch_manager: [
        'branch manager',
        'branchmanager',
        '\u0645\u062f\u064a\u0631 \u0641\u0631\u0639'
    ],
    ceo: [
        'ceo',
        'chief executive officer',
        'general manager',
        '\u0631\u0626\u064a\u0633 \u062a\u0646\u0641\u064a\u0630\u064a',
        '\u0645\u062f\u064a\u0631 \u0639\u0627\u0645'
    ]
};

function containsAllWords(text, words) {
    return words.every(word => text.includes(word));
}

function textMatchesAlias(text, alias) {
    if (text === alias || text.includes(alias)) return true;
    return containsAllWords(text, alias.split(' ').filter(Boolean));
}

function getItemSearchableTexts(item) {
    return extractSearchableTexts(
        item?.name,
        item?.display_name,
        item?.label,
        item?.title,
        item?.slug,
        item?.code
    );
}

function itemMatchesAliases(item, aliases) {
    const searchableTexts = getItemSearchableTexts(item);
    return searchableTexts.some(text =>
        aliases.some(alias => textMatchesAlias(text, alias))
    );
}

function textEqualsAlias(text, alias) {
    return text === alias;
}

function roleMatchesPolicy(role, policy) {
    const aliases = JOB_POLICY_ALIASES[policy] || [];
    const searchableTexts = getItemSearchableTexts(role);

    return searchableTexts.some(text =>
        aliases.some(alias => textEqualsAlias(text, alias))
    );
}

export function filterEmployeeRoleOptions(roles) {
    if (!Array.isArray(roles)) return [];
    const excludedAliases = Object.values(ROLE_EXCLUSIONS).flat();

    return roles.filter(role => !itemMatchesAliases(role, excludedAliases));
}

export function resolveEmployeeJobPolicy(job) {
    if (!job) return null;

    if (itemMatchesAliases(job, JOB_POLICY_ALIASES.supervisor)) {
        return 'supervisor';
    }

    if (itemMatchesAliases(job, JOB_POLICY_ALIASES.branch_manager)) {
        return 'branch_manager';
    }

    if (itemMatchesAliases(job, JOB_POLICY_ALIASES.ceo)) {
        return 'ceo';
    }

    return null;
}

export function getEmployeeJobPolicyState({ jobId, jobs = [], roles = [] }) {
    const job = jobs.find(item => item.id == jobId);
    const policy = resolveEmployeeJobPolicy(job);
    const allowedRoles = filterEmployeeRoleOptions(roles);
    const forcedRoles = policy
        ? allowedRoles.filter(role => roleMatchesPolicy(role, policy))
        : [];

    return {
        policy,
        forcedRoleIds: forcedRoles.map(role => role.id),
        forceRoles: forcedRoles.length > 0,
        isSupervisorJob: policy === 'supervisor',
        isBranchManagerJob: policy === 'branch_manager',
        isCeoJob: policy === 'ceo',
        isMultiBranchJob: policy === 'supervisor' || policy === 'branch_manager'
    };
}

export function getRoleSubmissionName(role) {
    if (!role) return '';

    if (typeof role.name === 'string') return role.name;
    if (role.name && typeof role.name === 'object') {
        return role.name.en || role.name.ar || '';
    }

    if (typeof role.display_name === 'string') return role.display_name;
    if (role.display_name && typeof role.display_name === 'object') {
        return role.display_name.en || role.display_name.ar || '';
    }

    return role.slug || role.code || String(role.id ?? '');
}

function normalizeSelectedIds(value) {
    if (value === null || value === undefined || value === '') return [];
    const rawValues = Array.isArray(value) ? value : [value];

    return rawValues
        .map(item => item?.id ?? item?.value ?? item)
        .filter(item => item !== null && item !== undefined && item !== '')
        .map(item => {
            const numberValue = Number(item);
            return Number.isNaN(numberValue) ? item : numberValue;
        });
}

export function buildEmployeeSubmissionPayload(data, roles = []) {
    const branchIds = normalizeSelectedIds(data.branch_id);
    const entityIds = normalizeSelectedIds(data.entity_id);
    const roleNames = normalizeSelectedIds(data.roles)
        .map(id => {
            const role = roles.find(item => item.id == id);
            return getRoleSubmissionName(role) || String(id);
        })
        .filter(Boolean);

    const payload = {
        ...data,
        roles: roleNames,
        status: data.status ? 1 : 0
    };

    delete payload.branch_id;
    delete payload.entity_id;

    if (branchIds.length > 0) {
        payload.branch_id = branchIds[0];
        payload.branch_ids = branchIds;
    }

    if (entityIds.length > 0) {
        payload.entity_id = entityIds[0];
        payload.entity_ids = entityIds;
    }

    return payload;
}
