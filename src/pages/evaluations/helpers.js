export const extractCollection = response => {
    const candidates = [
        response,
        response?.data,
        response?.data?.data,
        response?.items,
        response?.results,
        response?.evaluations,
        response?.templates,
        response?.data?.evaluations,
        response?.data?.templates,
        response?.data?.items,
        response?.data?.results,
        response?.data?.entities,
        response?.data?.teachers,
        response?.data?.students,
        response?.data?.evaluation_parameters,
        response?.entities,
        response?.teachers,
        response?.students,
        response?.evaluation_parameters
    ];

    return candidates.find(Array.isArray) || [];
};

export const extractRecord = response =>
    response?.data?.data || response?.data || response || null;

export const getLocalizedText = (value, locale = 'en') => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string' || typeof value === 'number') {
        return String(value);
    }
    if (typeof value === 'object') {
        return (
            value[locale] ||
            value[locale?.split('-')[0]] ||
            value.en ||
            value.ar ||
            value.name ||
            value.label ||
            ''
        );
    }
    return '';
};

export const normalizeDashboard = value => {
    const normalized = getLocalizedText(value, 'en')
        .toLowerCase()
        .replace(/[_\s/]+/g, '-');

    if (
        normalized.includes('super-admin') ||
        normalized.includes('main-administration') ||
        normalized.includes('الادارة-العامة') ||
        normalized.includes('الإدارة-العامة')
    ) {
        return 'admin-portal-main-administration';
    }
    if (
        normalized.includes('branch-manager') ||
        normalized.includes('inspector') ||
        normalized.includes('مشرف')
    ) {
        return 'branch-manager';
    }
    if (normalized.includes('admin-portal-branch') || normalized.includes('ادارة-الفرع') || normalized.includes('إدارة-الفرع')) {
        return 'admin-portal-branch';
    }
    if (normalized.includes('teacher') || normalized.includes('معلم')) return 'teacher';
    if (normalized.includes('student') || normalized.includes('طالب')) return 'student';
    if (normalized.includes('entity') || normalized.includes('جهة')) return 'entity';
    return normalized;
};

export const getUserDashboards = user => {
    const roles = Array.isArray(user?.roles) ? user.roles : [];
    const dashboards = new Set();

    roles.forEach(role => {
        const normalizedRole = normalizeDashboard(
            typeof role === 'string'
                ? role
                : role?.name || role?.display_name || role?.slug
        );

        if (normalizedRole === 'admin-portal-main-administration') {
            dashboards.add('admin-portal-main-administration');
        } else if (normalizedRole === 'branch-manager') {
            dashboards.add('branch-manager');
            dashboards.add('admin-portal-branch');
        } else if (normalizedRole) {
            dashboards.add(normalizedRole);
        }
    });

    return dashboards;
};

export const canSubmitEvaluationTemplate = (template, user) => {
    const templateDashboards = Array.isArray(template?.dashboards)
        ? template.dashboards.map(normalizeDashboard).filter(Boolean)
        : [];

    if (!templateDashboards.length) return false;

    const userDashboards = getUserDashboards(user);
    return templateDashboards.some(dashboard => userDashboards.has(dashboard));
};

export const getEvaluationTargetName = (evaluation, locale) => {
    const target =
        evaluation?.evaluated ||
        evaluation?.evaluatee ||
        evaluation?.evaluated_user ||
        evaluation?.entity ||
        evaluation?.teacher ||
        evaluation?.student;

    return (
        getLocalizedText(target?.name, locale) ||
        target?.full_name ||
        target?.name ||
        evaluation?.evaluated_name ||
        evaluation?.evaluated_id ||
        '-'
    );
};

const getPersonName = (person, locale) => {
    if (!person) return '';

    return (
        getLocalizedText(person?.name, locale) ||
        getLocalizedText(person?.full_name, locale) ||
        getLocalizedText(person?.display_name, locale) ||
        getLocalizedText(person?.user?.name, locale) ||
        getLocalizedText(person?.profile?.name, locale) ||
        getLocalizedText(person, locale)
    );
};

const isEntityManager = person => {
    const roles = [
        ...(Array.isArray(person?.roles) ? person.roles : []),
        ...(Array.isArray(person?.user?.roles) ? person.user.roles : []),
        person?.role,
        person?.user_type,
        person?.type
    ];

    return roles.some(role => {
        const value = getLocalizedText(
            typeof role === 'object' ? role?.name || role?.display_name || role?.slug : role,
            'en'
        ).toLowerCase();

        return value.includes('entity manager') || value.includes('entity_manager') || value.includes('مدير جهة');
    }) || Boolean(person?.entity_manager || person?.manager?.entity);
};

const getEntityManagerEntityName = (person, evaluation, locale) =>
    getLocalizedText(person?.entity?.name, locale) ||
    getLocalizedText(person?.user?.entity?.name, locale) ||
    getLocalizedText(person?.entity_manager?.entity?.name, locale) ||
    getLocalizedText(person?.manager?.entity?.name, locale) ||
    getLocalizedText(evaluation?.evaluator_entity?.name, locale) ||
    getLocalizedText(evaluation?.evaluator_entity_name, locale);

// Evaluation responses are returned from different endpoints. Some expose the
// evaluator as a user/profile object, while others return only a localized name.
// Resolve all supported response shapes so the View modal always shows the name.
export const getEvaluatorName = (evaluation, locale) => {
    const candidates = [
        evaluation?.evaluator,
        evaluation?.evaluator_user,
        evaluation?.evaluatorUser,
        evaluation?.evaluated_by,
        evaluation?.evaluatedBy,
        evaluation?.created_by,
        evaluation?.creator,
        evaluation?.submitted_by
    ];

    for (const candidate of candidates) {
        const name = getPersonName(candidate, locale);
        if (!name) continue;

        const entityName = getEntityManagerEntityName(candidate, evaluation, locale);
        if (entityName && isEntityManager(candidate)) {
            return `${name} — ${entityName}`;
        }

        return name;
    }

    return (
        getLocalizedText(evaluation?.evaluator_name, locale) ||
        getLocalizedText(evaluation?.evaluator_full_name, locale) ||
        getLocalizedText(evaluation?.created_by_name, locale) ||
        getLocalizedText(evaluation?.creator_name, locale) ||
        '-'
    );
};

export const getTemplateName = (item, locale) => {
    const template =
        item?.evaluation_parameter ||
        item?.template ||
        item?.evaluation_template;

    return (
        getLocalizedText(template?.name, locale) ||
        getLocalizedText(item?.template_name, locale) ||
        getLocalizedText(item?.name, locale) ||
        item?.evaluation_parameter_id ||
        '-'
    );
};

export const resolveTotalCount = (response, fallback) =>
    Number(
        response?.meta?.total ??
            response?.total ??
            response?.data?.meta?.total ??
            response?.data?.total ??
            fallback
    ) || 0;
