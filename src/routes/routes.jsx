import Roles from '@/pages/roles/Roles';
import Login from '../pages/auth/Login';
import Home from '@/pages/Home';
import Permissions from '@/pages/permissions/Permissions';
import Resources from '@/pages/resources/Resources';
import Notifications from '@/pages/notifications/Notifications';
import ActivityLogs from '@/pages/activity-logs/ActivityLogs';
import AcademicQualifications from '@/pages/academic-qualifications/AcademicQualifications';
import Branches from '@/pages/branches/Branches';
import MainPrograms from '@/pages/main-programs/MainPrograms';
import QuranParts from '@/pages/quoran-parts/QuranParts';
import AttendanceTypes from '@/pages/attendances-types/AttendanceTypes';
import MemorizationPrograms from '@/pages/memorization-program-entity-types/MemorizationPrograms';
import EducationPrograms from '@/pages/education-program-entity-types/EducationPrograms';
import Kinships from '@/pages/kinships/Kinships';
import Jobs from '@/pages/jobs/Jobs';
import Cities from '@/pages/cities/Cities';
import Neighborhoods from '@/pages/neighborhoods/Neighborhoods';
import AcademicYears from '@/pages/academic-years/AcademicYears';
import AcademicLevels from '@/pages/academic-levels/AcademicLevels';
import LocationTypes from '@/pages/location-types/LocationTypes';
import Specifications from '@/pages/specifications/Specifications';
import Activities from '@/pages/activities/Activities';
import EntityCategories from '@/pages/entity-categories/EntityCategories';
import SessionPeriods from '@/pages/session-periods/SessionPeriods';

export const routes = [
    {
        path: '/',
        element: <Home />
    },
    {
        path: '/roles',
        element: <Roles />
    },
    {
        path: '/permissions',
        element: <Permissions />
    },
    {
        path: '/resources',
        element: <Resources />
    },
    {
        path: '/notifications',
        element: <Notifications />
    },
    {
        path: '/activity-logs',
        element: <ActivityLogs />
    },
    {
        path: '/academic-qualifications',
        element: <AcademicQualifications />
    },
    {
        path: '/branches',
        element: <Branches />
    },
    {
        path: '/main-programs',
        element: <MainPrograms />
    },
    {
        path: '/quoran-parts',
        element: <QuranParts />
    },
    {
        path: '/attendances-types',
        element: <AttendanceTypes />
    },
    {
        path: '/memorization-program-entity-types',
        element: <MemorizationPrograms />
    },
    {
        path: '/education-program-entity-types',
        element: <EducationPrograms />
    },
    {
        path: '/kinships',
        element: <Kinships />
    },
    {
        path: '/jobs',
        element: <Jobs />
    },
    {
        path: '/cities',
        element: <Cities />
    },
    {
        path: '/neighborhoods',
        element: <Neighborhoods />
    },
    {
        path: '/academic-years',
        element: <AcademicYears />
    },
    {
        path: '/academic-levels',
        element: <AcademicLevels />
    },
    {
        path: '/location-types',
        element: <LocationTypes />
    },
    {
        path: '/specifications',
        element: <Specifications />
    },
    {
        path: '/activities',
        element: <Activities />
    },
    {
        path: '/entity-categories',
        element: <EntityCategories />
    },
    {
        path: '/session-periods',
        element: <SessionPeriods />
    },
    {
        path: '/neighborhoods',
        element: <Neighborhoods />
    }
];
