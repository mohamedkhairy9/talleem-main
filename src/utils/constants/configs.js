import {
    HiHome,
    HiUsers,
    HiShieldCheck,
    HiCollection,
    HiBell,
    HiClipboardList,
    HiAcademicCap,
    HiOfficeBuilding,
    HiBookOpen,
    HiUserGroup,
    HiBriefcase,
    HiLocationMarker,
    HiCalendar,
    HiChartBar,
    HiMap,
    HiTag,
    HiLightningBolt,
    HiFolder,
    HiClock,
    HiCog,
    HiInformationCircle,
    HiDocumentText,
    HiShieldExclamation,
    HiPhotograph,
    HiIdentification,
    HiGlobe,
    HiUser,
    HiClipboardCheck,
    HiTemplate,
    HiDocumentAdd
} from 'react-icons/hi';
import { VscDebugBreakpointLog } from 'react-icons/vsc';
import { IoGrid } from 'react-icons/io5';

export const sideMenuTabs = [
    { titleKey: 'sidebar.home', path: '/', icon: HiHome },

    // نظام الحماية
    {
        titleKey: 'sidebar.security_system',
        icon: HiShieldCheck,
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
                titleKey: 'sidebar.warning_reasons',
                path: '/warning-reasons',
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
        subMenu: [
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
                        titleKey: 'sidebar.employees',
                        path: '/employees',
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
                        path: '/entity-activities',
                        icon: VscDebugBreakpointLog
                    },
                    {
                        titleKey: 'sidebar.session_modes',
                        path: '/session-modes',
                        icon: VscDebugBreakpointLog
                    },

                    {
                        titleKey: 'sidebar.attendance_types',
                        path: '/attendances-types',
                        icon: VscDebugBreakpointLog
                    },
                    {
                        titleKey: 'sidebar.academic_qualifications',
                        path: '/academic-qualifications',
                        icon: VscDebugBreakpointLog
                    },
                    {
                        titleKey: 'sidebar.majors',
                        path: '/majors',
                        icon: VscDebugBreakpointLog
                    },
                    {
                        titleKey: 'sidebar.academic_levels',
                        path: '/academic-levels',
                        icon: VscDebugBreakpointLog
                    },
                    {
                        titleKey: 'sidebar.evaluation-parameters',
                        path: '/evaluation-parameters',
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
        subMenu: [
            {
                titleKey: 'sidebar.entities',
                path: '/entities',
                icon: HiOfficeBuilding
            },
            // مديري الجهات
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
        ]
    },

    {
        titleKey: 'sidebar.notifications_system',
        icon: HiBell,
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

    {
        titleKey: 'sidebar.registration_requests',
        icon: HiDocumentAdd,
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
            }
        ]
    },

    {
        titleKey: 'sidebar.memorization_program_settings',
        icon: HiBookOpen,
        subMenu: [
            {
                titleKey: 'sidebar.session_periods',
                path: '/session-periods',
                icon: VscDebugBreakpointLog
            },
            {
                titleKey: 'sidebar.quoran_parts',
                path: '/quoran-parts',
                icon: VscDebugBreakpointLog
            },
            {
                titleKey: 'sidebar.academic_years',
                path: '/academic-years',
                icon: VscDebugBreakpointLog
            },
            {
                titleKey: 'sidebar.memorization-program-entity-types',
                path: '/memorization-program-entity-types',
                icon: VscDebugBreakpointLog
            },
            // Quran Management
            {
                titleKey: 'sidebar.mushaf_management',
                icon: HiBookOpen,
                path: '/quran-segmentation',
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
        subMenu: [
            {
                titleKey: 'sidebar.specifications',
                path: '/specifications',
                icon: VscDebugBreakpointLog
            },
            {
                titleKey: 'sidebar.academic_years',
                path: '/academic-years',
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
        titleKey: 'sidebar.instructional_supervision',
        icon: HiAcademicCap,
        subMenu: [
            {
                titleKey: 'sidebar.inspector-assignments',
                path: '/inspector-assignments',
                icon: VscDebugBreakpointLog
            },
        ]
    },
    {
        titleKey: 'sidebar.educational_supervision',
        icon: HiAcademicCap,
        subMenu: [
            {
                titleKey: 'sidebar.warning',
                path: '/issuing-warnings',
                icon: VscDebugBreakpointLog
            },
            {
                titleKey: 'sidebar.certificates',
                path: '/certificates',
                icon: VscDebugBreakpointLog
            },

        ]
    },

    // config file
    {
        titleKey: 'sidebar.configurations',
        path: '/configurations',
        icon: HiDocumentText
    },


    // صلة القربى

    // أنواع الغياب

    // ملف تعريف الموظفين

    // المعلمين

    // إدارات الفروع

    // أولياء الأمور
    {
        titleKey: 'sidebar.parents',
        path: '/parents',
        icon: HiUserGroup
    },

    // المستخدمين

    // الحضور الإلكتروني

    // إعداد السياسات واللافتات العامة
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

    // إعدادات برنامج التحفيظ

    // إعدادات برنامج التعليم
];
