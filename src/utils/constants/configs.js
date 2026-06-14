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

export const ROLE_SUPER_ADMIN = 'super-admin';
export const ROLE_BRANCH_ADMIN = 'branch manager';
export const ROLE_ENTITY_MANAGER = 'entity manager';

export const normalizeRole = role => {
    const str = typeof role === 'string' ? role : role?.name ?? role?.display_name ?? '';
    return typeof str === 'string'
        ? str.toLowerCase().replace(/\s+/g, '-').replace(/_/g, '-')
        : '';
};

export function isMenuItemVisible(item, normalizedUserRoles, can) {
    const roleOk =
        !item.allowedRoles?.length ||
        item.allowedRoles.some(ar => normalizedUserRoles.includes(normalizeRole(ar)));
    const permissionOk =
        !item.requiredPermission ||
        can(item.requiredPermission.resource, item.requiredPermission.action);

    if (item.subMenu?.length) {
        const anyChildVisible = item.subMenu.some(sub =>
            isMenuItemVisible(sub, normalizedUserRoles, can)
        );
        return anyChildVisible;
    }

    return roleOk && permissionOk;
}

export function filterMenuByVisibility(tabs, normalizedUserRoles, can) {
    return tabs
        .filter(tab => isMenuItemVisible(tab, normalizedUserRoles, can))
        .map(tab => {
            if (!tab.subMenu?.length) return tab;
            const filteredSub = filterSubMenuByVisibility(
                tab.subMenu,
                normalizedUserRoles,
                can
            );
            return filteredSub.length
                ? { ...tab, subMenu: filteredSub }
                : { ...tab, subMenu: [] };
        })
        .filter(tab => !tab.subMenu?.length || tab.subMenu.length > 0);
}

function filterSubMenuByVisibility(items, normalizedUserRoles, can) {
    const result = [];
    for (const item of items) {
        if (!isMenuItemVisible(item, normalizedUserRoles, can)) continue;
        if (item.subMenu?.length) {
            const filtered = filterSubMenuByVisibility(
                item.subMenu,
                normalizedUserRoles,
                can
            );
            if (filtered.length) result.push({ ...item, subMenu: filtered });
        } else {
            result.push(item);
        }
    }
    return result;
}

export const sideMenuTabs = [
    {
        titleKey: 'sidebar.security_system',
        icon: HiShieldCheck,
        subMenu: [
            {
                titleKey: 'sidebar.roles',
                path: '/roles',
                icon: VscDebugBreakpointLog,
                requiredPermission: { resource: 'roles', action: 'r' }
            },
            {
                titleKey: 'sidebar.permissions',
                path: '/permissions',
                icon: VscDebugBreakpointLog,
                requiredPermission: { resource: 'permissions', action: 'r' }
            },
            {
                titleKey: 'sidebar.users',
                path: '/users',
                icon: HiUser,
                requiredPermission: { resource: 'users', action: 'r' }
            },
            {
                titleKey: 'sidebar.activity_logs',
                path: '/activity-logs',
                icon: VscDebugBreakpointLog,
                requiredPermission: { resource: 'activity_logs', action: 'r' }
            },
            {
                titleKey: 'sidebar.import_errors',
                path: '/import-errors',
                icon: VscDebugBreakpointLog,
                requiredPermission: { resource: 'import_errors', action: 'r' }
            }
        ]
    },
    {
        titleKey: 'sidebar.system_settings',
        icon: HiCog,
        subMenu: [
            {
                titleKey: 'sidebar.system_lookup_files',
                icon: IoGrid,
                subMenu: [
                    {
                        titleKey: 'sidebar.main_programs',
                        path: '/main-programs',
                        icon: VscDebugBreakpointLog,
                        requiredPermission: { resource: 'main_programs', action: 'r' }
                    },
                    {
                        titleKey: 'sidebar.nationalities',
                        path: '/nationalities',
                        icon: VscDebugBreakpointLog,
                        requiredPermission: { resource: 'nationalities', action: 'r' }
                    },
                    {
                        titleKey: 'sidebar.countries',
                        path: '/countries',
                        icon: VscDebugBreakpointLog,
                        requiredPermission: { resource: 'countries', action: 'r' }
                    },
                    {
                        titleKey: 'sidebar.cities',
                        path: '/cities',
                        icon: VscDebugBreakpointLog,
                        requiredPermission: { resource: 'cities', action: 'r' }
                    },
                    {
                        titleKey: 'sidebar.neighborhoods',
                        path: '/neighborhoods',
                        icon: VscDebugBreakpointLog,
                        requiredPermission: { resource: 'neighborhoods', action: 'r' }
                    },
                    {
                        titleKey: 'sidebar.jobs',
                        path: '/jobs',
                        icon: VscDebugBreakpointLog,
                        requiredPermission: { resource: 'jobs', action: 'r' }
                    },
                    {
                        titleKey: 'sidebar.location_types',
                        path: '/location-types',
                        icon: VscDebugBreakpointLog,
                        requiredPermission: { resource: 'location_types', action: 'r' }
                    },
                    {
                        titleKey: 'sidebar.branches',
                        path: '/branches',
                        icon: VscDebugBreakpointLog,
                        requiredPermission: { resource: 'branches', action: 'r' }
                    },
                    {
                        titleKey: 'sidebar.branch_administrations',
                        path: '/branch-administrations',
                        icon: VscDebugBreakpointLog,
                        requiredPermission: { resource: 'branch_administrations', action: 'r' }
                    },
                    {
                        titleKey: 'sidebar.remotely_attendance_platforms',
                        path: '/remotely-attendance-platforms',
                        icon: VscDebugBreakpointLog,
                        requiredPermission: {
                            resource: 'remote_attendance_platforms',
                            action: 'r'
                        }
                    },
                    {
                        titleKey: 'sidebar.kinships',
                        path: '/kinships',
                        icon: VscDebugBreakpointLog,
                        requiredPermission: { resource: 'kinships', action: 'r' }
                    },
                    {
                        titleKey: 'sidebar.entity_activities',
                        path: '/entity-activities',
                        icon: VscDebugBreakpointLog,
                        requiredPermission: { resource: 'entity_activities', action: 'r' }
                    },
                    {
                        titleKey: 'sidebar.absences_types',
                        path: '/attendances-types',
                        icon: VscDebugBreakpointLog,
                        requiredPermission: { resource: 'attendance_types', action: 'r' }
                    },
                    {
                        titleKey: 'sidebar.warning_reasons',
                        path: '/warning-reasons',
                        icon: VscDebugBreakpointLog,
                        requiredPermission: { resource: 'warning_reasons', action: 'r' }
                    }
                ]
            },
            {
                titleKey: 'sidebar.configurations_file',
                path: '/configurations',
                icon: HiDocumentText,
                requiredPermission: { resource: 'workflow_admin', action: 'r' }
            },
            {
                titleKey: 'sidebar.evaluation_model_builder',
                path: '/evaluation-parameters',
                icon: VscDebugBreakpointLog,
                requiredPermission: { resource: 'evaluation_parameters', action: 'r' }
            },
            {
                titleKey: 'sidebar.policies_and_banners',
                icon: HiDocumentText,
                subMenu: [
                    {
                        titleKey: 'sidebar.privacy_policies',
                        path: '/privacy-policies',
                        icon: VscDebugBreakpointLog,
                        requiredPermission: {
                            resource: 'privacy-and-policies',
                            action: 'r'
                        }
                    },
                    {
                        titleKey: 'sidebar.about_us',
                        path: '/about-us',
                        icon: VscDebugBreakpointLog,
                        requiredPermission: { resource: 'about-us', action: 'r' }
                    },
                    {
                        titleKey: 'sidebar.general_banners',
                        path: '/general-banners',
                        icon: VscDebugBreakpointLog,
                        requiredPermission: { resource: 'banners', action: 'r' }
                    },
                    {
                        titleKey: 'sidebar.general_holidays',
                        path: '/general-holidays',
                        icon: VscDebugBreakpointLog,
                        requiredPermission: {
                            resource: 'general_holidays',
                            action: 'r'
                        }
                    }
                ]
            }
        ]
    },
    {
        titleKey: 'sidebar.profile_management',
        icon: HiUser,
        subMenu: [
            {
                titleKey: 'sidebar.entities',
                path: '/entities',
                icon: HiOfficeBuilding,
                requiredPermission: { resource: 'entities', action: 'r' }
            },
            {
                titleKey: 'sidebar.entity_managers',
                path: '/entity-managers',
                icon: HiUserGroup,
                requiredPermission: { resource: 'entity-managers', action: 'r' }
            },
            {
                titleKey: 'sidebar.teachers',
                path: '/teachers',
                icon: HiAcademicCap,
                requiredPermission: { resource: 'teachers', action: 'r' }
            },
            {
                titleKey: 'sidebar.students',
                path: '/students',
                icon: HiUserGroup,
                requiredPermission: { resource: 'students', action: 'r' }
            },
            {
                titleKey: 'sidebar.parents',
                path: '/parents',
                icon: HiUserGroup,
                requiredPermission: { resource: 'parents', action: 'r' }
            },
            {
                titleKey: 'sidebar.employees',
                path: '/employees',
                icon: VscDebugBreakpointLog,
                requiredPermission: { resource: 'employees', action: 'r' }
            }
        ]
    },
    {
        titleKey: 'sidebar.notifications_system',
        icon: HiBell,
        subMenu: [
            {
                titleKey: 'sidebar.notification_templates',
                path: '/notification-templates',
                icon: VscDebugBreakpointLog,
                requiredPermission: { resource: 'notifications', action: 'r' }
            },
            {
                titleKey: 'sidebar.notifications',
                path: '/notifications',
                icon: VscDebugBreakpointLog,
                requiredPermission: { resource: 'notifications', action: 'r' }
            }
        ]
    },
    {
        titleKey: 'sidebar.memorization_program_settings',
        icon: HiBookOpen,
        subMenu: [
            {
                titleKey: 'sidebar.memorization_lookup_files',
                icon: IoGrid,
                subMenu: [
                    {
                        titleKey: 'sidebar.memorization-program-entity-types',
                        path: '/memorization-program-entity-types',
                        icon: VscDebugBreakpointLog,
                        requiredPermission: {
                            resource: 'memorization_program_entity_types',
                            action: 'r'
                        }
                    },
                    {
                        titleKey: 'sidebar.session_periods',
                        path: '/session-periods',
                        icon: VscDebugBreakpointLog,
                        requiredPermission: { resource: 'session_periods', action: 'r' }
                    }
                ]
            },
            {
                titleKey: 'sidebar.mushaf_management',
                icon: HiBookOpen,
                path: '/quran-segmentation',
                requiredPermission: { resource: 'quran_segments', action: 'r' }
            },
            {
                titleKey: 'sidebar.exam_settings',
                icon: VscDebugBreakpointLog,
                subMenu: [
                    {
                        titleKey: 'sidebar.suggested_exam_templates',
                        path: '/suggested-exam-templates',
                        icon: VscDebugBreakpointLog,
                        requiredPermission: { resource: 'exam_segments', action: 'r' }
                    },
                    {
                        titleKey: 'sidebar.exam_segments_count',
                        path: '/required-exam-segments',
                        icon: VscDebugBreakpointLog,
                        requiredPermission: { resource: 'exam_segments', action: 'r' }
                    }
                ]
            }
        ]
    },
    {
        titleKey: 'sidebar.education_program_settings',
        icon: HiAcademicCap,
        subMenu: [
            {
                titleKey: 'sidebar.main_education_programs',
                icon: IoGrid,
                subMenu: [
                    {
                        titleKey: 'sidebar.education-program-entity-types',
                        path: '/education-program-entity-types',
                        icon: VscDebugBreakpointLog,
                        requiredPermission: {
                            resource: 'education_program_entity_types',
                            action: 'r'
                        }
                    },
                    {
                        titleKey: 'sidebar.academic_years',
                        path: '/academic-years',
                        icon: VscDebugBreakpointLog,
                        requiredPermission: { resource: 'academic_years', action: 'r' }
                    },
                    {
                        titleKey: 'sidebar.academic_levels',
                        path: '/academic-levels',
                        icon: VscDebugBreakpointLog,
                        requiredPermission: { resource: 'academic_levels', action: 'r' }
                    }
                ]
            },
            {
                titleKey: 'sidebar.education_materials_setup',
                icon: IoGrid,
                subMenu: [
                    {
                        titleKey: 'sidebar.specifications',
                        path: '/specifications',
                        icon: VscDebugBreakpointLog,
                        requiredPermission: { resource: 'specifications', action: 'r' }
                    },
                    {
                        titleKey: 'sidebar.majors',
                        path: '/majors',
                        icon: VscDebugBreakpointLog,
                        requiredPermission: { resource: 'majors', action: 'r' }
                    }
                ]
            }
        ]
    },
    {
        titleKey: 'sidebar.educational_supervision',
        icon: HiAcademicCap,
        subMenu: [
            {
                titleKey: 'sidebar.inspector-assignments',
                path: '/inspector-assignments',
                icon: VscDebugBreakpointLog,
                requiredPermission: { resource: 'supervisor_assignments', action: 'r' }
            }
        ]
    },
    {
        titleKey: 'sidebar.certificates',
        path: '/certificates',
        icon: HiDocumentText,
        requiredPermission: { resource: 'certificates', action: 'r' }
    },
    {
        titleKey: 'sidebar.warning',
        path: '/issuing-warnings',
        icon: HiDocumentText,
        requiredPermission: { resource: 'warnings', action: 'r' }
    },
    {
        titleKey: 'sidebar.request_management',
        icon: HiDocumentAdd,
        subMenu: [
            {
                titleKey: 'sidebar.join_requests_settings',
                icon: HiCog,
                subMenu: [
                    {
                        titleKey: 'sidebar.request_types',
                        path: '/request-types',
                        icon: VscDebugBreakpointLog,
                        requiredPermission: { resource: 'request_types', action: 'r' }
                    },
                    {
                        titleKey: 'sidebar.phases',
                        path: '/phases',
                        icon: VscDebugBreakpointLog,
                        requiredPermission: { resource: 'phases', action: 'r' }
                    },
                    {
                        titleKey: 'sidebar.join_request_forms',
                        path: '/join-request-forms',
                        icon: VscDebugBreakpointLog,
                        requiredPermission: { resource: 'join_request_forms', action: 'r' }
                    }
                ]
            },
            {
                titleKey: 'sidebar.join_requests',
                icon: VscDebugBreakpointLog,
                subMenu: [
                    {
                        titleKey: 'sidebar.join_requests_entities',
                        path: '/join-requests/entities',
                        icon: VscDebugBreakpointLog,
                        requiredPermission: { resource: 'join_requests', action: 'r' }
                    },
                    {
                        titleKey: 'sidebar.join_requests_teachers',
                        path: '/join-requests/teachers',
                        icon: VscDebugBreakpointLog,
                        requiredPermission: { resource: 'join_requests', action: 'r' }
                    },
                    {
                        titleKey: 'sidebar.join_requests_supervisors',
                        path: '/join-requests/supervisors',
                        icon: VscDebugBreakpointLog,
                        requiredPermission: { resource: 'join_requests', action: 'r' }
                    }
                ]
            }
        ]
    },
    {
        titleKey: 'sidebar.dashboard_reports',
        path: '/',
        icon: HiHome
    }
];
