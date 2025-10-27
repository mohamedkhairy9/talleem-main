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
    HiClipboardCheck
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
                titleKey: 'sidebar.activity_logs',
                path: '/activity-logs',
                icon: HiClipboardList
            }
        ]
    },

    // الإعدادات العامة للنظام
    {
        titleKey: 'sidebar.system_settings',
        icon: HiCog,
        subMenu: [
            {
                titleKey: 'sidebar.academic_qualifications',
                path: '/academic-qualifications',
                icon: HiAcademicCap
            },
            {
                titleKey: 'sidebar.jobs',
                path: '/jobs',
                icon: HiBriefcase
            },
            {
                titleKey: 'sidebar.countries',
                path: '/countries',
                icon: HiGlobe
            },
            {
                titleKey: 'sidebar.cities',
                path: '/cities',
                icon: HiLocationMarker
            },
            {
                titleKey: 'sidebar.neighborhoods',
                path: '/neighborhoods',
                icon: HiLocationMarker
            },
            {
                titleKey: 'sidebar.location_types',
                path: '/location-types',
                icon: HiMap
            },
            {
                titleKey: 'sidebar.branches',
                path: '/branches',
                icon: HiOfficeBuilding
            },
            {
                titleKey: 'sidebar.nationalities',
                path: '/nationalities',
                icon: HiGlobe
            }
        ]
    },

    // برامج التعليم الرئيسية
    {
        titleKey: 'sidebar.main_education_programs',
        icon: HiBookOpen,
        subMenu: [
            {
                titleKey: 'sidebar.main_programs',
                path: '/main-programs',
                icon: HiBookOpen
            },
            {
                titleKey: 'sidebar.memorization_programs',
                path: '/memorization-program-entity-types',
                icon: HiAcademicCap
            },
            {
                titleKey: 'sidebar.education_programs',
                path: '/education-program-entity-types',
                icon: HiAcademicCap
            }
        ]
    },

    // صلة القربى
    {
        titleKey: 'sidebar.kinships',
        path: '/kinships',
        icon: HiUserGroup
    },

    // نشاطات الجهة
    {
        titleKey: 'sidebar.activities',
        path: '/activities',
        icon: HiLightningBolt
    },

    // أنواع الغياب
    {
        titleKey: 'sidebar.attendance_types',
        path: '/attendances-types',
        icon: HiClipboardList
    },

    // ملف تعريف الموظفين
    {
        titleKey: 'sidebar.employees',
        path: '/employees',
        icon: HiIdentification
    },

    // المعلمين
    {
        titleKey: 'sidebar.teachers',
        path: '/teachers',
        icon: HiAcademicCap
    },

    // مديري الكيانات
    {
        titleKey: 'sidebar.entity_managers',
        path: '/entity-managers',
        icon: HiUserGroup
    },

    // إدارات الفروع
    {
        titleKey: 'sidebar.branch_administrations',
        path: '/branch-administrations',
        icon: HiOfficeBuilding
    },

    // المستخدمين
    {
        titleKey: 'sidebar.users',
        path: '/users',
        icon: HiUser
    },

    // الحضور الإلكتروني
    {
        titleKey: 'sidebar.online_attendances',
        path: '/online-attendances',
        icon: HiClipboardCheck
    },

    // إعداد السياسات واللافتات العامة
    {
        titleKey: 'sidebar.policies_and_banners',
        icon: HiDocumentText,
        subMenu: [
            {
                titleKey: 'sidebar.about_us',
                path: '/about-us',
                icon: HiInformationCircle
            },
            {
                titleKey: 'sidebar.terms_and_conditions',
                path: '/term-and-condition',
                icon: HiDocumentText
            },
            {
                titleKey: 'sidebar.privacy_policies',
                path: '/privacy-policies',
                icon: HiShieldExclamation
            },
            {
                titleKey: 'sidebar.general_banners',
                path: '/general-banners',
                icon: HiPhotograph
            }
        ]
    },

    // إعدادات برنامج التحفيظ
    {
        titleKey: 'sidebar.memorization_program_settings',
        icon: HiBookOpen,
        subMenu: [
            {
                titleKey: 'sidebar.entity_categories',
                path: '/entity-categories',
                icon: HiFolder
            },
            {
                titleKey: 'sidebar.session_periods',
                path: '/session-periods',
                icon: HiClock
            },
            {
                titleKey: 'sidebar.quoran_parts',
                path: '/quoran-parts',
                icon: HiBookOpen
            }
        ]
    },

    // إعدادات برنامج التعليم
    {
        titleKey: 'sidebar.education_program_settings',
        icon: HiAcademicCap,
        subMenu: [
            {
                titleKey: 'sidebar.entity_categories',
                path: '/entity-categories',
                icon: HiFolder
            },
            {
                titleKey: 'sidebar.academic_years',
                path: '/academic-years',
                icon: HiCalendar
            },
            {
                titleKey: 'sidebar.academic_levels',
                path: '/academic-levels',
                icon: HiChartBar
            },
            {
                titleKey: 'sidebar.specifications',
                path: '/specifications',
                icon: HiTag
            }
        ]
    }
];
