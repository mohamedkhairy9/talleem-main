/**
 * Permission system: resource-based with action codes (c,r,u,d,ex,im,as,re,st,pl).
 * Backend returns user.permissions on the logged-in user (e.g. from /login or /user).
 * Supported shapes:
 *   - Object: { "entities": "c,r,u,d,ex,im", "users": "c,r,u,d,ex,im,as,re,st" }
 *   - Array:  [ "entities.c", "entities.r", "users.u", ... ]
 * We check with can(resource, action); super_admin role bypasses all checks.
 */

/** Map backend full action names to internal codes */
export const ACTION_NAME_TO_CODE = {
    create: 'c',
    read: 'r',
    update: 'u',
    delete: 'd',
    export: 'ex',
    import: 'im',
    assign: 'as',
    reset: 're',
    status: 'st',
    'manage-plans': 'pl',
};

export const PERMISSIONS_MAP = {
    c:  { en: 'create', ar: 'إضافة' },
    r:  { en: 'read', ar: 'عرض' },
    u:  { en: 'update', ar: 'تعديل' },
    d:  { en: 'delete', ar: 'حذف' },
    ex: { en: 'export', ar: 'تصدير' },
    im: { en: 'import', ar: 'استيراد' },
    as: { en: 'assign', ar: 'تعيين' },
    re: { en: 'reset', ar: 'إعادة تعيين' },
    st: { en: 'status', ar: 'تغيير الحالة' },
    pl: { en: 'manage-plans', ar: 'إدارة الخطط' },
};

/** All known permission action codes */
export const PERMISSION_ACTIONS = Object.keys(PERMISSIONS_MAP);

/**
 * Parse backend permission string (e.g. "c,r,u,d,ex,im") into array of action codes.
 * @param {string} str - Comma-separated action codes
 * @returns {string[]}
 */
export function parsePermissionActions(str) {
    if (!str || typeof str !== 'string') return [];
    return str.split(',').map(s => s.trim()).filter(Boolean);
}

/**
 * Parse a single "resource-action" or "resource.action" permission string into { resource, code }.
 * Backend may send "warning_reasons-create", "join_requests-read", "step_actions-update".
 * Action is normalized to internal code (c, r, u, d, ...).
 * @param {string} item
 * @returns {{ resource: string, code: string }|null}
 */
function parsePermissionString(item) {
    if (!item || typeof item !== 'string') return null;
    const s = item.trim();
    if (!s) return null;

    // Format "resource-action" (backend uses full action names; check longest first for "manage-plans")
    const actionNames = ['manage-plans', 'create', 'read', 'update', 'delete', 'export', 'import', 'assign', 'reset', 'status'];
    for (const actionName of actionNames) {
        const suffix = '-' + actionName;
        if (s.endsWith(suffix)) {
            const resource = s.slice(0, -suffix.length).trim();
            if (!resource) return null;
            const code = ACTION_NAME_TO_CODE[actionName];
            if (code) return { resource, code };
            return { resource, code: actionName };
        }
    }

    // Format "resource.action" (dot; action might be code or name)
    const dot = s.indexOf('.');
    if (dot !== -1) {
        const resource = s.slice(0, dot).trim();
        const action = s.slice(dot + 1).trim();
        if (!resource || !action) return null;
        const code = ACTION_NAME_TO_CODE[action] || action;
        return { resource, code };
    }

    return null;
}

/**
 * Normalize user.permissions from API into a Map: resource -> Set of action codes.
 * Supports:
 * - Object: { "entities": "c,r,u,d,ex,im", "users": "c,r,u,d" }
 * - Array "resource.action": [ "entities.c", "entities.r" ]
 * - Array "resource-action": [ "warning_reasons-create", "join_requests-read", "step_actions-update" ]
 * @param {Record<string, string>|string[]|null|undefined} raw
 * @returns {Map<string, Set<string>>}
 */
export function normalizeUserPermissions(raw) {
    const map = new Map();
    if (!raw) return map;

    if (Array.isArray(raw)) {
        for (const item of raw) {
            const parsed = parsePermissionString(item);
            if (!parsed) continue;
            if (!map.has(parsed.resource)) map.set(parsed.resource, new Set());
            map.get(parsed.resource).add(parsed.code);
        }
        return map;
    }

    if (typeof raw === 'object' && raw !== null) {
        for (const [resource, value] of Object.entries(raw)) {
            if (!resource) continue;
            const actions = typeof value === 'string'
                ? parsePermissionActions(value)
                : Array.isArray(value)
                    ? value.filter(a => typeof a === 'string')
                    : [];
            if (actions.length) map.set(resource, new Set(actions));
        }
        return map;
    }

    return map;
}

/**
 * Resource names as used by the backend (for route/sidebar mapping).
 * Path segments often use kebab-case; we map to backend resource names.
 */
export const RESOURCE_BY_PATH = {
    '/': null,
    '/roles': 'roles',
    '/permissions': 'permissions',
    '/users': 'users',
    '/activity-logs': 'activity_logs',
    '/import-errors': 'import_errors',
    '/evaluation-parameters': 'evaluation_parameters',
    '/main-programs': 'main_programs',
    '/countries': 'countries',
    '/nationalities': 'nationalities',
    '/cities': 'cities',
    '/neighborhoods': 'neighborhoods',
    '/jobs': 'jobs',
    '/location-types': 'location_types',
    '/branches': 'branches',
    '/branch-administrations': 'branch_administrations',
    '/remotely-attendance-platforms': 'remote_attendance_platforms',
    '/kinships': 'kinships',
    '/certification-names': 'certificate_names',
    '/attendances-types': 'attendance_types',
    '/academic-qualifications': 'academic_qualifications',
    '/academic-years': 'academic_years',
    '/academic-levels': 'academic_levels',
    '/majors': 'majors',
    '/activities': 'activities',
    '/entity-activities': 'entity_activities',
    '/warning-reasons': 'warning_reasons',
    '/about-us': 'about-us',
    '/term-and-condition': 'terms-and-conditions',
    '/privacy-policies': 'privacy-and-policies',
    '/general-banners': 'banners',
    '/general-holidays': 'general_holidays',
    '/employees': 'employees',
    '/teachers': 'teachers',
    '/entity-managers': 'entity-managers',
    '/parents': 'parents',
    '/entities': 'entities',
    '/students': 'students',
    '/notifications': 'notifications',
    '/notification-templates': 'notifications',
    '/session-periods': 'session_periods',
    '/memorization-program-entity-types': 'memorization_program_entity_types',
    '/education-program-entity-types': 'education_program_entity_types',
    '/specifications': 'specifications',
    '/inspector-assignments': 'supervisor_assignments',
    '/issuing-warnings': 'warnings',
    '/certificates': 'certificates',
    '/request-types': 'request_types',
    '/phases': 'phases',
    '/join-request-forms': 'join_request_forms',
    '/join-requests': 'join_requests',
    '/configurations': 'workflow_admin',
    '/quran-segmentation': 'quran_segments',
    '/suggested-exam-templates': 'exam_segments',
    '/required-exam-segments': 'exam_segments',
    '/session-modes': 'session_modes',
    '/online-attendances': 'online-attendances',
};

/**
 * Get required permission for a path (resource + 'r' for read access to the page).
 * @param {string} pathname
 * @returns {{ resource: string, action: string }|null}
 */
export function getRequiredPermissionForPath(pathname) {
    if (!pathname || typeof pathname !== 'string') return null;
    let normalized = pathname.replace(/\/$/, '').trim() || '/';
    if (normalized !== '/' && !normalized.startsWith('/')) normalized = '/' + normalized;
    if (RESOURCE_BY_PATH[normalized] !== undefined) {
        const resource = RESOURCE_BY_PATH[normalized];
        if (!resource) return null;
        return { resource, action: 'r' };
    }
    if (pathname.startsWith('/join-requests') || pathname.startsWith('join-requests')) return { resource: 'join_requests', action: 'r' };
    if (pathname.startsWith('/phases') || pathname.startsWith('phases')) return { resource: 'phases', action: 'r' };
    return null;
}
