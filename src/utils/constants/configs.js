import {
    HiHome,
    HiShieldCheck,
    HiBell,
    HiAcademicCap,
    HiOfficeBuilding,
    HiBookOpen,
    HiUserGroup,
    HiCog,
    HiDocumentText,
    HiUser,
    HiDocumentAdd
} from 'react-icons/hi';
import { VscDebugBreakpointLog } from 'react-icons/vsc';
import { IoGrid } from 'react-icons/io5';

// Roles: API returns user.roles as string array, e.g. ["entity", "branch manager"].
export const ROLE_SUPER_ADMIN = 'super-admin';
export const ROLE_BRANCH_ADMIN = 'branch manager';

/** Normalize role for comparison (e.g. "branch manager", "Branch Manager" -> "branch-manager"). Accepts string or object with .name */
export const normalizeRole = (role) => {
    const str = typeof role === 'string' ? role : role?.name ?? role?.display_name ?? '';
    return typeof str === 'string' ? str.toLowerCase().replace(/\s+/g, '-').replace(/_/g, '-') : '';
};

export const sideMenuTabs = [
    { titleKey: 'sidebar.home', path: '/', icon: HiHome, allowedRoles: [ROLE_SUPER_ADMIN, ROLE_BRANCH_ADMIN] },

    // نظام الحماية
    {
        titleKey: 'sidebar.security_system',
        icon: HiShieldCheck,
        allowedRoles: [ROLE_SUPER_ADMIN],
        subMenu: [
            {
                titleKey: 'sidebar.roles',
                path: '/roles',
                icon: VscDebugBreakpointLog
            },
            {
                titleKey: 'sidebar.permissions',
                path: '/permissions',
                icon: VscDebugBreakpointLog
            },
            {
                titleKey: 'sidebar.users',
                path: '/users',
                icon: HiUser
            },
            {
                titleKey: 'sidebar.activity_logs',
                path: '/activity-logs',
                icon: VscDebugBreakpointLog
            },
            {
                titleKey: 'sidebar.import_errors',
                path: '/import-errors',
                icon: VscDebugBreakpointLog
            }
        ]
    },

    // الإعدادات العامة للنظام
    {
        titleKey: 'sidebar.system_settings',
        icon: HiCog,
        allowedRoles: [ROLE_SUPER_ADMIN],
        subMenu: [
            {
                titleKey: 'sidebar.evaluation-parameters',
                path: '/evaluation-parameters',
                icon: VscDebugBreakpointLog
            },
            {
                titleKey: 'sidebar.configurations',
                path: '/configurations',
                icon: HiDocumentText
            },
            {
                titleKey: 'sidebar.lookups',
                icon: IoGrid,
                subMenu: [
                    {
                        titleKey: 'sidebar.main_programs',
                        path: '/main-programs',
                        icon: VscDebugBreakpointLog
                    },
                    {
                        titleKey: 'sidebar.countries',
                        path: '/countries',
                        icon: VscDebugBreakpointLog
                    },
                    {
                        titleKey: 'sidebar.nationalities',
                        path: '/nationalities',
                        icon: VscDebugBreakpointLog
                    },
                    {
                        titleKey: 'sidebar.cities',
                        path: '/cities',
                        icon: VscDebugBreakpointLog
                    },
                    {
                        titleKey: 'sidebar.neighborhoods',
                        path: '/neighborhoods',
                        icon: VscDebugBreakpointLog
                    },
                    {
                        titleKey: 'sidebar.jobs',
                        path: '/jobs',
                        icon: VscDebugBreakpointLog
                    },
                    {
                        titleKey: 'sidebar.location_types',
                        path: '/location-types',
                        icon: VscDebugBreakpointLog
                    },
                    {
                        titleKey: 'sidebar.branches',
                        path: '/branches',
                        icon: VscDebugBreakpointLog
                    },
                    {
                        titleKey: 'sidebar.branch_administrations',
                        path: '/branch-administrations',
                        icon: VscDebugBreakpointLog
                    },
                    {
                        titleKey: 'sidebar.remotely_attendance_platforms',
                        path: '/remotely-attendance-platforms',
                        icon: VscDebugBreakpointLog
                    },
                    {
                        titleKey: 'sidebar.kinships',
                        path: '/kinships',
                        icon: VscDebugBreakpointLog
                    },
                    {
                        titleKey: 'sidebar.certification-names',
                        path: '/certification-names',
                        icon: VscDebugBreakpointLog
                    },

                    {
                        titleKey: 'sidebar.entity_activities',
                        //path: '/entity-activities',
                        path: '/activities',
                        icon: VscDebugBreakpointLog
                    },
                    // {
                    //     titleKey: 'sidebar.session_modes',
                    //     path: '/session-modes',
                    //     icon: VscDebugBreakpointLog
                    // },
                    {
                        titleKey: 'sidebar.warning_reasons',
                        path: '/warning-reasons',
                        icon: VscDebugBreakpointLog
                    },
                    {
                        titleKey: 'sidebar.absences_types',
                        path: '/attendances-types',
                        icon: VscDebugBreakpointLog
                    },
                    {
                        titleKey: 'sidebar.academic_qualifications',
                        path: '/academic-qualifications',
                        icon: VscDebugBreakpointLog
                    },
                    {
                        titleKey: 'sidebar.academic_years',
                        path: '/academic-years',
                        icon: VscDebugBreakpointLog
                    },        
                    {
                        titleKey: 'sidebar.majors',
                        path: '/majors',
                        icon: VscDebugBreakpointLog
                    }
                ]
            },
            {
                titleKey: 'sidebar.policies_and_banners',
                icon: HiDocumentText,
                subMenu: [
                    {
                        titleKey: 'sidebar.about_us',
                        path: '/about-us',
                        icon: VscDebugBreakpointLog
                    },
                    {
                        titleKey: 'sidebar.terms_and_conditions',
                        path: '/term-and-condition',
                        icon: VscDebugBreakpointLog
                    },
                    {
                        titleKey: 'sidebar.privacy_policies',
                        path: '/privacy-policies',
                        icon: VscDebugBreakpointLog
                    },
                    {
                        titleKey: 'sidebar.general_banners',
                        path: '/general-banners',
                        icon: VscDebugBreakpointLog
                    }
                ]
            }
        ]
    },

    {
        titleKey: 'sidebar.profile_management',
        icon: HiUser,
        allowedRoles: [ROLE_SUPER_ADMIN],
        subMenu: [
            {
                titleKey: 'sidebar.entities',
                path: '/entities',
                icon: HiOfficeBuilding
            },
            {
                titleKey: 'sidebar.entity_managers',
                path: '/entity-managers',
                icon: HiUserGroup
            },
            {
                titleKey: 'sidebar.teachers',
                path: '/teachers',
                icon: HiAcademicCap
            },
            {
                titleKey: 'sidebar.students',
                path: '/students',
                icon: HiUserGroup
            },
            {
                titleKey: 'sidebar.parents',
                path: '/parents',
                icon: HiUserGroup
            },
            {
                titleKey: 'sidebar.employees',
                path: '/employees',
                icon: VscDebugBreakpointLog
            }
        ]
    },

    {
        titleKey: 'sidebar.notifications_system',
        icon: HiBell,
        allowedRoles: [ROLE_SUPER_ADMIN],
        subMenu: [
            {
                titleKey: 'sidebar.notification_templates',
                path: '/notification-templates',
                icon: VscDebugBreakpointLog
            },
            {
                titleKey: 'sidebar.notifications',
                path: '/notifications',
                icon: VscDebugBreakpointLog
            }
        ]
    },

    // Full registration module: super admin only. Branch manager sees only "Join requests" (separate item below).
    {
        titleKey: 'sidebar.registration_requests',
        icon: HiDocumentAdd,
        allowedRoles: [ROLE_SUPER_ADMIN],
        subMenu: [
            {
                titleKey: 'sidebar.request_types',
                path: '/request-types',
                icon: VscDebugBreakpointLog
            },
            {
                titleKey: 'sidebar.phases',
                path: '/phases',
                icon: VscDebugBreakpointLog
            },
            {
                titleKey: 'sidebar.join_request_forms',
                path: '/join-request-forms',
                icon: VscDebugBreakpointLog
            },
            {
                titleKey: 'sidebar.join_requests',
                path: '/join-requests',
                icon: VscDebugBreakpointLog
            }
        ]
    },
    // Branch manager only: single link to Join requests (no access to request types, phases, or join request forms).
    {
        titleKey: 'sidebar.join_requests',
        path: '/join-requests',
        icon: HiDocumentAdd,
        allowedRoles: [ROLE_BRANCH_ADMIN]
    },

    {
        titleKey: 'sidebar.memorization_program_settings',
        icon: HiBookOpen,
        allowedRoles: [ROLE_SUPER_ADMIN],
        subMenu: [
            {
                titleKey: 'sidebar.session_periods',
                path: '/session-periods',
                icon: VscDebugBreakpointLog
            },
            {
                titleKey: 'sidebar.academic_levels',
                path: '/academic-levels',
                icon: VscDebugBreakpointLog
            },
            // {
            //     titleKey: 'sidebar.quoran_parts',
            //     path: '/quoran-parts',
            //     icon: VscDebugBreakpointLog
            // },
            {
                titleKey: 'sidebar.memorization-program-entity-types',
                path: '/memorization-program-entity-types',
                icon: VscDebugBreakpointLog
            },
            // Quran Management
            {
                titleKey: 'sidebar.mushaf_management',
                icon: HiBookOpen,
                path: '/quran-segmentation'
            },

            {
                titleKey: 'sidebar.exam_settings',
                icon: VscDebugBreakpointLog,
                subMenu: [
                    {
                        titleKey: 'sidebar.suggested_exam_templates',
                        path: '/suggested-exam-templates',
                        icon: VscDebugBreakpointLog
                    },
                    {
                        titleKey: 'sidebar.exam_segments_count',
                        path: '/exam-segments-count',
                        icon: VscDebugBreakpointLog
                    }
                ]
            }
        ]
    },

    {
        titleKey: 'sidebar.education_program_settings',
        icon: HiAcademicCap,
        allowedRoles: [ROLE_SUPER_ADMIN],
        subMenu: [
            {
                titleKey: 'sidebar.specifications',
                path: '/specifications',
                icon: VscDebugBreakpointLog
            },
            {
                titleKey: 'sidebar.education-program-entity-types',
                path: '/education-program-entity-types',
                icon: VscDebugBreakpointLog
            }
        ]
    },
    {
        titleKey: 'sidebar.educational_supervision',
        icon: HiAcademicCap,
        allowedRoles: [ROLE_SUPER_ADMIN],
        subMenu: [
            {
                titleKey: 'sidebar.inspector-assignments',
                path: '/inspector-assignments',
                icon: VscDebugBreakpointLog
            },
            {
                titleKey: 'sidebar.warning',
                path: '/issuing-warnings',
                icon: VscDebugBreakpointLog
            },
            {
                titleKey: 'sidebar.certificates',
                path: '/certificates',
                icon: VscDebugBreakpointLog
            }
        ]
    },

    // صلة القربى

    // أنواع الغياب

    // ملف تعريف الموظفين

    // المعلمين

    // إدارات الفروع

];
