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
        ADD: roleId => `/roles/${roleId}/permissions`,
        REMOVE: roleId => `/roles/${roleId}/permissions`
    },
    NOTIFICATIONS: {
        LIST: '/notifications'
    },
    NOTIFICATION_TEMPLATES: {
        LIST: '/notification-templates'
    },
    NOTIFICATION_TRIGGER: {
        TRIGGER: '/notifications/trigger'
    },
    NOTIFICATION_SCHEDULE: {
        SCHEDULE: '/notifications/schedule'
    },
    LANGUAGE: {
        SWITCH: locale => `profile/locale/${locale}`
    },
    ACTIVITY_LOGS: {
        LIST: '/activity-logs'
    },
    ACADEMIC_QUALIFICATIONS: {
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
        CREATE: '/attendance-types',
        LIST: '/attendance-types',
        DETAILS: id => `/attendance-types/${id}`,
        UPDATE: id => `/attendance-types/${id}`,
        DELETE: id => `/attendance-types/${id}`
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
    },
    LOCATION_TYPES: {
        CREATE: '/location-types',
        LIST: '/location-types',
        DETAILS: id => `/location-types/${id}`,
        UPDATE: id => `/location-types/${id}`,
        DELETE: id => `/location-types/${id}`
    },
    SPECIFICATIONS: {
        CREATE: '/specifications',
        LIST: '/specifications',
        DETAILS: id => `/specifications/${id}`,
        UPDATE: id => `/specifications/${id}`,
        DELETE: id => `/specifications/${id}`
    },
    ACTIVITIES: {
        CREATE: '/activities',
        LIST: '/activities',
        DETAILS: id => `/activities/${id}`,
        UPDATE: id => `/activities/${id}`,
        DELETE: id => `/activities/${id}`
    },
    ENTITY_CATEGORIES: {
        CREATE: '/entity-categories',
        LIST: '/entity-categories',
        DETAILS: id => `/entity-categories/${id}`,
        UPDATE: id => `/entity-categories/${id}`,
        DELETE: id => `/entity-categories/${id}`
    },
    SESSION_PERIODS: {
        CREATE: '/session-periods',
        LIST: '/session-periods',
        DETAILS: id => `/session-periods/${id}`,
        UPDATE: id => `/session-periods/${id}`,
        DELETE: id => `/session-periods/${id}`
    },
    ABOUT_US: {
        GET: '/about-us',
        UPDATE: '/about-us',
        DELETE: '/about-us'
    },
    TERMS_AND_CONDITIONS: {
        GET: '/term-and-condition',
        UPDATE: '/term-and-condition',
        DELETE: '/term-and-condition'
    },
    PRIVACY_POLICIES: {
        GET: '/privacy-and-policy',
        UPDATE: '/privacy-and-policy',
        DELETE: '/privacy-and-policy'
    },
    GENERAL_BANNERS: {
        CREATE: '/banners',
        LIST: '/banners',
        DETAILS: id => `/banners/${id}`,
        UPDATE: id => `/banners/${id}`,
        DELETE: id => `/banners/${id}`
    },
    EMPLOYEES: {
        CREATE: '/employees',
        LIST: '/employees',
        DETAILS: id => `/employees/${id}`,
        UPDATE: id => `/employees/${id}`,
        DELETE: id => `/employees/${id}`
    },
    NATIONALITIES: {
        CREATE: '/nationalities',
        LIST: '/nationalities',
        DETAILS: id => `/nationalities/${id}`,
        UPDATE: id => `/nationalities/${id}`,
        DELETE: id => `/nationalities/${id}`
    },
    USERS: {
        CREATE: '/users',
        LIST: '/users',
        DETAILS: id => `/users/${id}`,
        UPDATE: id => `/users/${id}`,
        DELETE: id => `/users/${id}`
    },
    STUDENTS: {
        CREATE: '/students',
        LIST: '/students',
        DETAILS: id => `/students/${id}`,
        UPDATE: id => `/students/${id}`,
        DELETE: id => `/students/${id}`,
        IMPORT: '/student-import',
        EXPORT_EXAMPLE: '/student-example-export'
    },
    COUNTRIES: {
        CREATE: '/countries',
        LIST: '/countries',
        DETAILS: id => `/countries/${id}`,
        UPDATE: id => `/countries/${id}`,
        DELETE: id => `/countries/${id}`
    },
    ONLINE_ATTENDANCES: {
        CREATE: '/online-attendances',
        LIST: '/online-attendances',
        DETAILS: id => `/online-attendances/${id}`,
        UPDATE: id => `/online-attendances/${id}`,
        DELETE: id => `/online-attendances/${id}`
    },
    ENTITIES: {
        CREATE: '/entities',
        LIST: '/entities',
        DETAILS: id => `/entities/${id}`,
        UPDATE: id => `/entities/${id}`,
        DELETE: id => `/entities/${id}`,
        IMPORT: '/entities-import',
        EXPORT_EXAMPLE: '/entities-example-export'
    },
    TEACHERS: {
        CREATE: '/teachers',
        LIST: '/teachers',
        DETAILS: id => `/teachers/${id}`,
        UPDATE: id => `/teachers/${id}`,
        DELETE: id => `/teachers/${id}`,
        IMPORT: '/teacher-import',
        EXPORT: '/teachers-export',
        EXPORT_EXAMPLE: '/teacher-export-example'
    },
    ENTITY_MANAGERS: {
        CREATE: '/entity-managers',
        LIST: '/entity-managers',
        DETAILS: id => `/entity-managers/${id}`,
        UPDATE: id => `/entity-managers/${id}`,
        DELETE: id => `/entity-managers/${id}`
    },
    BRANCH_ADMINISTRATIONS: {
        CREATE: '/branch-administrations',
        LIST: '/branch-administrations',
        DETAILS: id => `/branch-administrations/${id}`,
        UPDATE: id => `/branch-administrations/${id}`,
        DELETE: id => `/branch-administrations/${id}`
    },
    PARENTS: {
        CREATE: '/parents',
        LIST: '/parents',
        DETAILS: id => `/parents/${id}`,
        UPDATE: id => `/parents/${id}`,
        DELETE: id => `/parents/${id}`
    },
    ENTITY_ACTIVITIES: {
        CREATE: '/entity-activities',
        LIST: '/entity-activities',
        DETAILS: id => `/entity-activities/${id}`,
        UPDATE: id => `/entity-activities/${id}`,
        DELETE: id => `/entity-activities/${id}`
    },
    MAJORS: {
        CREATE: '/majors',
        LIST: '/majors',
        DETAILS: id => `/majors/${id}`,
        UPDATE: id => `/majors/${id}`,
        DELETE: id => `/majors/${id}`
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
    NOTIFICATION_TEMPLATES: 'notification-templates',
    NOTIFICATION_TRIGGER: 'notification-trigger',
    NOTIFICATION_SCHEDULE: 'notification-schedule',
    LANGUAGE: 'language',
    ACTIVITY_LOGS: 'activity-logs',
    ACADEMIC_QUALIFICATIONS: 'academic-qualifications',
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
    ACADEMIC_LEVELS: 'academic-levels',
    LOCATION_TYPES: 'location-types',
    SPECIFICATIONS: 'specifications',
    ACTIVITIES: 'activities',
    ENTITY_CATEGORIES: 'entity-categories',
    SESSION_PERIODS: 'session-periods',
    ABOUT_US: 'about-us',
    TERMS_AND_CONDITIONS: 'term-and-condition',
    PRIVACY_POLICIES: 'privacy-and-policy',
    GENERAL_BANNERS: 'general-banners',
    EMPLOYEES: 'employees',
    NATIONALITIES: 'nationalities',
    USERS: 'users',
    STUDENTS: 'students',
    COUNTRIES: 'countries',
    ONLINE_ATTENDANCES: 'online-attendances',
    ENTITIES: 'entities',
    TEACHERS: 'teachers',
    ENTITY_MANAGERS: 'entity-managers',
    BRANCH_ADMINISTRATIONS: 'branch-administrations',
    PARENTS: 'parents',
    ENTITY_ACTIVITIES: 'entity-activities',
    MAJORS: 'majors'
};
