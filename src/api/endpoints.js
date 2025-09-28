export const API_URLS = {
    AUTH: {
        REGISTER: '/register',
        LOGIN: '/login',
        USER: '/user',
        LOGOUT: '/logout'
    },
    ROLES: {
        CREATE: '/roles',
        LIST: '/roles',
        DETAILS: id => `/roles/${id}`,
        UPDATE: id => `/roles/${id}`,
        DELETE: id => `/roles/${id}`
    },
    PERMISSIONS: {
        CREATE: '/permissions',
        LIST: '/permissions',
        DETAILS: id => `/permissions/${id}`,
        UPDATE: id => `/permissions/${id}`,
        DELETE: id => `/permissions/${id}`
    },
    RESOURCES: {
        CREATE: '/resources',
        LIST: '/resources',
        DETAILS: id => `/resources/${id}`,
        UPDATE: id => `/resources/${id}`,
        DELETE: id => `/resources/${id}`
    },
    ROLE_ASSIGNMENT: {
        ADD: (userId, roleId) => `/users/${userId}/roles/${roleId}`,
        REMOVE: (userId, roleId) => `/users/${userId}/roles/${roleId}`
    },
    PERMISSION_ASSIGNMENT: {
        ADD: (userId, permissionId) =>
            `/users/${userId}/permissions/${permissionId}`,
        REMOVE: (userId, permissionId) =>
            `/users/${userId}/permissions/${permissionId}`
    },
    NOTIFICATIONS: {
        LIST: '/notifications',
        CREATE: '/notifications'
    },
    LANGUAGE: {
        SWITCH: locale => `profile/locale/${locale}`
    },
    ACTIVITY_LOGS: {
        LIST: '/activity-logs'
    },
    ACADAMIC_QUALIFICATIONS: {
        CREATE: '/academic-qualifications',
        LIST: '/academic-qualifications',
        DETAILS: id => `/academic-qualifications/${id}`,
        UPDATE: id => `/academic-qualifications/${id}`,
        DELETE: id => `/academic-qualifications/${id}`
    },
    BRANCHES: {
        CREATE: '/branches',
        LIST: '/branches',
        DETAILS: id => `/branches/${id}`,
        UPDATE: id => `/branches/${id}`,
        DELETE: id => `/branches/${id}`
    },
    MAIN_PROGRAMS: {
        CREATE: '/main-programs',
        LIST: '/main-programs',
        DETAILS: id => `/main-programs/${id}`,
        UPDATE: id => `/main-programs/${id}`,
        DELETE: id => `/main-programs/${id}`
    },
    QUORAN_PARTS: {
        CREATE: '/quoran-parts',
        LIST: '/quoran-parts',
        DETAILS: id => `/quoran-parts/${id}`,
        UPDATE: id => `/quoran-parts/${id}`,
        DELETE: id => `/quoran-parts/${id}`
    },
    ATTENDANCES_TYPES: {
        CREATE: '/attendances-types',
        LIST: '/attendances-types',
        DETAILS: id => `/attendances-types/${id}`,
        UPDATE: id => `/attendances-types/${id}`,
        DELETE: id => `/attendances-types/${id}`
    },
    MEMORIZATION_PROGRAM_ENTITY_TYPES: {
        CREATE: '/memorization-program-entity-types',
        LIST: '/memorization-program-entity-types',
        DETAILS: id => `/memorization-program-entity-types/${id}`,
        UPDATE: id => `/memorization-program-entity-types/${id}`,
        DELETE: id => `/memorization-program-entity-types/${id}`
    },
    EDUCATION_PROGRAM_ENTITY_TYPES: {
        CREATE: '/education-program-entity-types',
        LIST: '/education-program-entity-types',
        DETAILS: id => `/education-program-entity-types/${id}`,
        UPDATE: id => `/education-program-entity-types/${id}`,
        DELETE: id => `/education-program-entity-types/${id}`
    },
    KINSHIPS: {
        CREATE: '/kinships',
        LIST: '/kinships',
        DETAILS: id => `/kinships/${id}`,
        UPDATE: id => `/kinships/${id}`,
        DELETE: id => `/kinships/${id}`
    },
    JOBS: {
        CREATE: '/jobs',
        LIST: '/jobs',
        DETAILS: id => `/jobs/${id}`,
        UPDATE: id => `/jobs/${id}`,
        DELETE: id => `/jobs/${id}`
    },
    CITIES: {
        CREATE: '/cities',
        LIST: '/cities',
        DETAILS: id => `/cities/${id}`,
        UPDATE: id => `/cities/${id}`,
        DELETE: id => `/cities/${id}`
    },
    NEIGHBORHOODS: {
        CREATE: '/neighborhoods',
        LIST: '/neighborhoods',
        DETAILS: id => `/neighborhoods/${id}`,
        UPDATE: id => `/neighborhoods/${id}`,
        DELETE: id => `/neighborhoods/${id}`
    },
    ACADEMIC_YEARS: {
        CREATE: '/academic-years',
        LIST: '/academic-years',
        DETAILS: id => `/academic-years/${id}`,
        UPDATE: id => `/academic-years/${id}`,
        DELETE: id => `/academic-years/${id}`
    },
    ACADEMIC_LEVELS: {
        CREATE: '/academic-levels',
        LIST: '/academic-levels',
        DETAILS: id => `/academic-levels/${id}`,
        UPDATE: id => `/academic-levels/${id}`,
        DELETE: id => `/academic-levels/${id}`
    }
};

export const API_KEYS = {
    REGISTER: 'register',
    LOGIN: 'login',
    USER: 'user',
    LOGOUT: 'logout',
    ROLES: 'roles',
    PERMISSIONS: 'permissions',
    RESOURCES: 'resources',
    ROLE_ASSIGNMENT: 'role-assignment',
    PERMISSION_ASSIGNMENT: 'permission-assignment',
    NOTIFICATIONS: 'notifications',
    LANGUAGE: 'language',
    ACTIVITY_LOGS: 'activity-logs',
    ACADAMIC_QUALIFICATIONS: 'academic-qualifications',
    BRANCHES: 'branches',
    MAIN_PROGRAMS: 'main-programs',
    QUORAN_PARTS: 'quoran-parts',
    ATTENDANCES_TYPES: 'attendances-types',
    MEMORIZATION_PROGRAM_ENTITY_TYPES: 'memorization-program-entity-types',
    EDUCATION_PROGRAM_ENTITY_TYPES: 'education-program-entity-types',
    KINSHIPS: 'kinships',
    JOBS: 'jobs',
    CITIES: 'cities',
    NEIGHBORHOODS: 'neighborhoods',
    ACADEMIC_YEARS: 'academic-years',
    ACADEMIC_LEVELS: 'academic-levels'
};
