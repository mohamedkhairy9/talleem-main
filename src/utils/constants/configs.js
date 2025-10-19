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
    HiIdentification
} from 'react-icons/hi';
import { VscDebugBreakpointLog } from 'react-icons/vsc';

export const sideMenuTabs = [
    { titleKey: 'sidebar.home', path: '/', icon: HiHome },
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
            }
        ]
    },
    {
        titleKey: 'sidebar.system_settings',
        icon: HiCog,
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
    },
    // { titleKey: 'sidebar.permissions', path: '/permissions', icon: HiShieldCheck },
    // { titleKey: 'sidebar.resources', path: '/resources', icon: HiCollection },
    // { titleKey: 'sidebar.notifications', path: '/notifications', icon: HiBell },
    // { titleKey: 'sidebar.activity_logs', path: '/activity-logs', icon: HiClipboardList },
    {
        titleKey: 'sidebar.academic_qualifications',
        path: '/academic-qualifications',
        icon: HiAcademicCap
    },
    { titleKey: 'sidebar.branches', path: '/branches', icon: HiOfficeBuilding },
    {
        titleKey: 'sidebar.main_programs',
        path: '/main-programs',
        icon: HiBookOpen
    },
    {
        titleKey: 'sidebar.quoran_parts',
        path: '/quoran-parts',
        icon: HiBookOpen
    },
    {
        titleKey: 'sidebar.attendance_types',
        path: '/attendances-types',
        icon: HiClipboardList
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
    },
    { titleKey: 'sidebar.kinships', path: '/kinships', icon: HiUserGroup },
    { titleKey: 'sidebar.jobs', path: '/jobs', icon: HiBriefcase },
    { titleKey: 'sidebar.cities', path: '/cities', icon: HiLocationMarker },
    {
        titleKey: 'sidebar.neighborhoods',
        path: '/neighborhoods',
        icon: HiLocationMarker
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
        titleKey: 'sidebar.location_types',
        path: '/location-types',
        icon: HiMap
    },
    {
        titleKey: 'sidebar.specifications',
        path: '/specifications',
        icon: HiTag
    },
    {
        titleKey: 'sidebar.activities',
        path: '/activities',
        icon: HiLightningBolt
    },
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
        titleKey: 'sidebar.employees',
        path: '/employees',
        icon: HiIdentification
    }
];
