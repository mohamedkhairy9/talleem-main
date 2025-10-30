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
    HiTemplate
} from 'react-icons/hi';
import { VscDebugBreakpointLog } from 'react-icons/vsc';

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
                titleKey: 'sidebar.users',
                path: '/users',
                icon: HiUser
            },
            {
                titleKey: 'sidebar.activity_logs',
                path: '/activity-logs',
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
                icon: HiIdentification
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
                titleKey: 'sidebar.online_attendances',
                path: '/online-attendances',
                icon: VscDebugBreakpointLog
            },
            {
                titleKey: 'sidebar.kinships',
                path: '/kinships',
                icon: VscDebugBreakpointLog
            },
            {
                titleKey: 'sidebar.entity_activities',
                path: '/entity-activities',
                icon: VscDebugBreakpointLog
            },
            {
                titleKey: 'sidebar.entity_categories',
                path: '/entity-categories',
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
            {
                titleKey: 'sidebar.teachers',
                path: '/teachers',
                icon: HiAcademicCap
            },
            {
                titleKey: 'sidebar.students',
                path: '/students',
                icon: HiUserGroup
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
            },
        ]
    },

    // صلة القربى

    // الأنشطة
    {
        titleKey: 'sidebar.activities',
        path: '/activities',
        icon: HiLightningBolt
    },

    // أنواع الغياب

    // ملف تعريف الموظفين

    // المعلمين

    // مديري الجهات
    {
        titleKey: 'sidebar.entity_managers',
        path: '/entity-managers',
        icon: HiUserGroup
    },

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
