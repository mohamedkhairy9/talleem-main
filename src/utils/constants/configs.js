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
    HiClock
} from 'react-icons/hi';

export const sideMenuTabs = [
    { title: 'Home', path: '/', icon: HiHome },
    { title: 'Roles', path: '/roles', icon: HiUsers },
    // { title: 'Permissions', path: '/permissions', icon: HiShieldCheck },
    // { title: 'Resources', path: '/resources', icon: HiCollection },
    // { title: 'Notifications', path: '/notifications', icon: HiBell },
    // { title: 'Activity Logs', path: '/activity-logs', icon: HiClipboardList },
    {
        title: 'Academic Qualifications',
        path: '/academic-qualifications',
        icon: HiAcademicCap
    },
    { title: 'Branches', path: '/branches', icon: HiOfficeBuilding },
    { title: 'Main Programs', path: '/main-programs', icon: HiBookOpen },
    { title: 'Quran Parts', path: '/quoran-parts', icon: HiBookOpen },
    {
        title: 'Attendance Types',
        path: '/attendances-types',
        icon: HiClipboardList
    },
    {
        title: 'Memorization Programs',
        path: '/memorization-program-entity-types',
        icon: HiAcademicCap
    },
    {
        title: 'Education Programs',
        path: '/education-program-entity-types',
        icon: HiAcademicCap
    },
    { title: 'Kinships', path: '/kinships', icon: HiUserGroup },
    { title: 'Jobs', path: '/jobs', icon: HiBriefcase },
    { title: 'Cities', path: '/cities', icon: HiLocationMarker },
    { title: 'Neighborhoods', path: '/neighborhoods', icon: HiLocationMarker },
    { title: 'Academic Years', path: '/academic-years', icon: HiCalendar },
    { title: 'Academic Levels', path: '/academic-levels', icon: HiChartBar },
    { title: 'Location Types', path: '/location-types', icon: HiMap },
    { title: 'Specifications', path: '/specifications', icon: HiTag },
    { title: 'Activities', path: '/activities', icon: HiLightningBolt },
    { title: 'Entity Categories', path: '/entity-categories', icon: HiFolder },
    { title: 'Session Periods', path: '/session-periods', icon: HiClock }
];
