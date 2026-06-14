import Roles from '@/pages/roles/Roles';
import Login from '../pages/auth/Login';
import Home from '@/pages/Home';
import Home2 from '@/pages/Home2';
import Permissions from '@/pages/permissions/Permissions';
import Resources from '@/pages/resources/Resources';
import Notifications from '@/pages/notifications/Notifications';
import NotificationTemplates from '@/pages/notification-templates/NotificationTemplates';
import ActivityLogs from '@/pages/activity-logs/ActivityLogs';
import ImportErrors from '@/pages/import-errors/ImportErrors';
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
import SessionPeriods from '@/pages/session-periods/SessionPeriods';
import AboutUs from '@/pages/about-us/AboutUs';
import TermsAndConditions from '@/pages/terms-and-conditions/TermsAndConditions';
import PrivacyPolicies from '@/pages/privacy-policies/PrivacyPolicies';
import GeneralBanners from '@/pages/general-banners/GeneralBanners';
import GeneralHolidays from '@/pages/general-holidays/GeneralHolidays';
import Employees from '@/pages/employees/Employees';
import Teachers from '@/pages/teachers/Teachers';
import EntityManagers from '@/pages/entity-managers/EntityManagers';
import BranchAdministrations from '@/pages/branch-administrations/BranchAdministrations';
import Parents from '@/pages/parents/Parents';
import Nationalities from '@/pages/nationalities/Nationalities';
import Users from '@/pages/users/Users';
import Countries from '@/pages/countries/Countries';
import OnlineAttendances from '@/pages/online-attendances/OnlineAttendances';
import Entities from '@/pages/entities/Entities';
import Students from '@/pages/students/Students';
import EntityActivities from '@/pages/entity-activities/EntityActivities';
import Majors from '@/pages/majors/Majors';
import RemotelyAttendancePlatforms from '@/pages/remotely-attendance-platforms/RemotelyAttendancePlatforms';
import WarningReasons from '@/pages/warning-reasons/WarningReasons';
import EvaluationParameters from '@/pages/evaluation-parameters/EvaluationParameters';
import Configurations from '@/pages/configurations/Configurations';
import InspectorAssignments from '@/pages/inspector-assignments/Inspectorassignments';
import IssuingWarnings from '@/pages/issuing-warnings/Warnings';
import CertificationNames from '@/pages/certification-names/CertificationNames';
import QuranSegmentationView from '@/pages/quran/QuranSegmentationView';
import SuggestedExamTemplates from '@/pages/quran/SuggestedExamTemplates';
import SessionModes from '@/pages/sessionModes/SessionModes';
import Certificates from '@/pages/upload-certificate/Certificates';
import ExamSegmentsCount from '@/pages/exam-segments/ExamSegmentsCount';
import RequestTypes from '@/pages/request-types/RequestTypes';
import Phases from '@/pages/phases/Phases';
import Steps from '@/pages/steps/Steps';
import JoinRequestForms from '@/pages/join-request-forms/JoinRequestForms';
import JoinRequests from '@/pages/join-requests/JoinRequests';

export const routes = [
    {
        path: '/q/u/r/a/n',
        element: <Home2 />
    },
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
        path: '/notification-templates',
        element: <NotificationTemplates />
    },
    {
        path: '/session-modes',
        element: <SessionModes />
    },
    {
        path: '/activity-logs',
        element: <ActivityLogs />
    },
    {
        path: '/import-errors',
        element: <ImportErrors />
    },
    {
        path: '/quran-segmentation',
        element: <QuranSegmentationView />
    },
    {
        path: '/suggested-exam-templates',
        element: <SuggestedExamTemplates />
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
        path: '/inspector-assignments',
        element: <InspectorAssignments />
    },
    {
        path: '/evaluation-parameters',
        element: <EvaluationParameters />
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
        path: '/warning-reasons',
        element: <WarningReasons />
    },
    {
        path: '/issuing-warnings',
        element: <IssuingWarnings />
    },
    {
        path: '/certification-names',
        element: <CertificationNames />
    },
    {
        path: '/certificates',
        element: <Certificates />
    },

    {
        path: '/configurations',
        element: <Configurations />
    },
    {
        path: '/session-periods',
        element: <SessionPeriods />
    },
    {
        path: '/required-exam-segments',
        element: <ExamSegmentsCount />
    },
    {
        path: '/neighborhoods',
        element: <Neighborhoods />
    },
    {
        path: '/about-us',
        element: <AboutUs />
    },
    {
        path: '/term-and-condition',
        element: <TermsAndConditions />
    },
    {
        path: '/privacy-policies',
        element: <PrivacyPolicies />
    },
    {
        path: '/general-banners',
        element: <GeneralBanners />
    },
    {
        path: '/general-holidays',
        element: <GeneralHolidays />
    },
    {
        path: '/employees',
        element: <Employees />
    },
    {
        path: '/teachers',
        element: <Teachers />
    },
    {
        path: '/entity-managers',
        element: <EntityManagers />
    },
    {
        path: '/branch-administrations',
        element: <BranchAdministrations />
    },
    {
        path: '/parents',
        element: <Parents />
    },
    {
        path: '/nationalities',
        element: <Nationalities />
    },
    {
        path: '/users',
        element: <Users />
    },
    {
        path: '/countries',
        element: <Countries />
    },
    {
        path: '/online-attendances',
        element: <OnlineAttendances />
    },
    {
        path: '/entities',
        element: <Entities />
    },
    {
        path: '/students',
        element: <Students />
    },
    {
        path: '/entity-activities',
        element: <EntityActivities />
    },
    {
        path: '/majors',
        element: <Majors />
    },
    {
        path: '/remotely-attendance-platforms',
        element: <RemotelyAttendancePlatforms />
    },
    {
        path: '/request-types',
        element: <RequestTypes />
    },
    {
        path: '/phases',
        element: <Phases />
    },
    {
        path: '/phases/:phaseId/steps',
        element: <Steps />
    },
    {
        path: '/join-request-forms',
        element: <JoinRequestForms />
    },
    {
        path: '/join-requests',
        element: <JoinRequests />
    },
    {
        path: '/join-requests/:category',
        element: <JoinRequests />
    }
];
