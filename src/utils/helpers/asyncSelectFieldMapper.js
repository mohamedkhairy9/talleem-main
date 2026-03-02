import i18next from 'i18next';
import { createAsyncLoadOptionsWithIncluded } from './asyncSelectHelpers';
import { nationalitiesService } from '@/api/services/nationalities.service';
import { citiesService } from '@/api/services/cities.service';
import { branchesService } from '@/api/services/branches.service';
import { entitiesService } from '@/api/services/entities.service';
import { mainProgramsService } from '@/api/services/mainPrograms.service';
import { academicQualificationsService } from '@/api/services/academicQualifications.service';
import { majorsService } from '@/api/services/majors.service';
import { academicLevelsService } from '@/api/services/academicLevels.service';
import { specificationsService } from '@/api/services/specifications.service';
import { neighborhoodsService } from '@/api/services/neighborhoods.service';
import { locationTypesService } from '@/api/services/locationTypes.service';
import { sessionModesService } from '@/api/services/essionModes.service';
import { educationProgramEntityTypesService } from '@/api/services/educationProgramEntityTypes.service';
import { memorizationProgramEntityTypesService } from '@/api/services/memorizationProgramEntityTypes.service';
import { activitiesService } from '@/api/services/activities.service';
import { usersService } from '@/api/services/users.service';
import { studentsService } from '@/api/services/students.service';
import { teachersService } from '@/api/services/teachers.service';
import { employeesService } from '@/api/services/employees.service';
import { rolesService } from '@/api/services/roles.service';
import { warningReasonsService } from '@/api/services/warningReasons.service';
import { joinRequestFormsService } from '@/api/services/joinRequestForms.service';
import { countriesService } from '@/api/services/countries.service';
import { jobsService } from '@/api/services/jobs.service';
import { kinshipsService } from '@/api/services/kinships.service';

/**
 * Maps field names to their corresponding API service methods.
 * getById is used to resolve a single option by value (ID) for paginated async select display.
 */
export const FIELD_TO_SERVICE_MAP = {
    nationality_id: {
        service: nationalitiesService.getNationalities,
        getById: nationalitiesService.getNationality,
        serviceName: 'nationalitiesService.getNationalities'
    },
    city_id: {
        service: citiesService.getCities,
        getById: citiesService.getCity,
        serviceName: 'citiesService.getCities'
    },
    branch_id: {
        service: branchesService.getBranches,
        getById: branchesService.getBranch,
        serviceName: 'branchesService.getBranches'
    },
    entity_id: {
        service: entitiesService.getEntities,
        getById: entitiesService.getEntity,
        serviceName: 'entitiesService.getEntities'
    },
    main_program_id: {
        service: mainProgramsService.getMainPrograms,
        getById: mainProgramsService.getMainProgram,
        serviceName: 'mainProgramsService.getMainPrograms'
    },
    academic_qualification_id: {
        service: academicQualificationsService.getAcademicQualifications,
        getById: academicQualificationsService.getAcademicQualification,
        serviceName: 'academicQualificationsService.getAcademicQualifications'
    },
    major_id: {
        service: majorsService.getMajors,
        getById: majorsService.getMajor,
        serviceName: 'majorsService.getMajors'
    },
    academic_level_id: {
        service: academicLevelsService.getAcademicLevels,
        getById: academicLevelsService.getAcademicLevel,
        serviceName: 'academicLevelsService.getAcademicLevels'
    },
    specification_id: {
        service: specificationsService.getSpecifications,
        getById: specificationsService.getSpecification,
        serviceName: 'specificationsService.getSpecifications'
    },
    neighborhood_id: {
        service: neighborhoodsService.getNeighborhoods,
        getById: neighborhoodsService.getNeighborhood,
        serviceName: 'neighborhoodsService.getNeighborhoods'
    },
    location_type_id: {
        service: locationTypesService.getLocationTypes,
        getById: locationTypesService.getLocationType,
        serviceName: 'locationTypesService.getLocationTypes'
    },
    session_mode_id: {
        service: sessionModesService.getSessionModes,
        getById: sessionModesService.getSessionMode,
        serviceName: 'sessionModesService.getSessionModes'
    },
    education_program_entity_type_id: {
        service: educationProgramEntityTypesService.getEducationProgramEntityTypes,
        getById: educationProgramEntityTypesService.getEducationProgramEntityType,
        serviceName: 'educationProgramEntityTypesService.getEducationProgramEntityTypes'
    },
    memorization_program_entity_type_id: {
        service: memorizationProgramEntityTypesService.getMemorizationProgramEntityTypes,
        getById: memorizationProgramEntityTypesService.getMemorizationProgramEntityType,
        serviceName: 'memorizationProgramEntityTypesService.getMemorizationProgramEntityTypes'
    },
    activity_ids: {
        service: activitiesService.getActivities,
        getById: activitiesService.getActivity,
        serviceName: 'activitiesService.getActivities'
    },
    user_id: {
        service: usersService.getUsers,
        getById: usersService.getUser,
        serviceName: 'usersService.getUsers'
    },
    student_id: {
        service: studentsService.getStudents,
        getById: studentsService.getStudent,
        serviceName: 'studentsService.getStudents'
    },
    teacher_id: {
        service: teachersService.getTeachers,
        getById: teachersService.getTeacher,
        serviceName: 'teachersService.getTeachers'
    },
    employee_id: {
        service: employeesService.getEmployees,
        getById: employeesService.getEmployee,
        serviceName: 'employeesService.getEmployees'
    },
    role_id: {
        service: rolesService.getRoles,
        getById: rolesService.getRole,
        serviceName: 'rolesService.getRoles'
    },
    warning_reason_id: {
        service: warningReasonsService.getWarningReasons,
        getById: warningReasonsService.getWarningReason,
        serviceName: 'warningReasonsService.getWarningReasons'
    },
    join_request_form_id: {
        service: joinRequestFormsService.getJoinRequestForms,
        getById: joinRequestFormsService.getJoinRequestForm,
        serviceName: 'joinRequestFormsService.getJoinRequestForms'
    },
    country_id: {
        service: countriesService.getCountries,
        getById: countriesService.getCountry,
        serviceName: 'countriesService.getCountries'
    },
    job_id: {
        service: jobsService.getJobs,
        getById: jobsService.getJob,
        serviceName: 'jobsService.getJobs'
    },
    kinship_id: {
        service: kinshipsService.getKinships,
        getById: kinshipsService.getKinship,
        serviceName: 'kinshipsService.getKinships'
    }
};

/**
 * Gets the API service for a field name
 * @param {string} fieldName - The field name
 * @returns {Object|null} Service object with service function and name, or null if not found
 */
export function getServiceForField(fieldName) {
    return FIELD_TO_SERVICE_MAP[fieldName] || null;
}

/**
 * Checks if a field should use async select (has API service mapping)
 * @param {string} fieldName - The field name
 * @returns {boolean} True if field should use async select
 */
export function shouldUseAsyncSelect(fieldName) {
    return !!FIELD_TO_SERVICE_MAP[fieldName];
}

/**
 * Creates async loadOptions for a field (paginated; compatible with react-select-async-paginate).
 * @param {string} fieldName - The field name
 * @param {Object} additionalParams - Additional params to pass to API
 * @param {Object} includeOption - Option to always include (e.g., from oldData)
 * @returns {Function|null} loadOptions function or null if field doesn't have a service
 */
export function createLoadOptionsForField(fieldName, additionalParams = {}, includeOption = null) {
    const fieldService = getServiceForField(fieldName);

    if (!fieldService || !fieldService.service) {
        return null;
    }

    return createAsyncLoadOptionsWithIncluded(
        fieldService.service,
        additionalParams,
        includeOption
    );
}

/**
 * Creates getOptionByValue(value) => Promise<option> for a field.
 * Used to resolve the selected option by ID when it's not in the current page (paginated async select).
 * @param {string} fieldName - The field name
 * @returns {((value: number|string) => Promise<{ label: string, value: any, id: any }|null>)|null}
 */
export function createGetOptionByValueForField(fieldName) {
    const fieldService = getServiceForField(fieldName);
    if (!fieldService?.getById) return null;

    const getById = fieldService.getById;
    const lang = () => i18next.language;

    return async (value) => {
        // Reject empty/invalid ids to avoid bad API calls (e.g. GET /activities/ when id is [] or '')
        if (value === undefined || value === null || value === '' ||
            (Array.isArray(value) && value.length === 0)) return null;
        // For multi-select fields, value is an array; getById expects a single id - don't call with array
        if (Array.isArray(value)) return null;
        try {
            const item = await getById(value);
            const data = item?.data ?? item;
            if (!data) return null;
            const name = data.name?.[lang()] || data.name?.en || data.name?.ar || data.name || data.label || '';
            return {
                label: name,
                value: data.id !== undefined ? data.id : data.value,
                id: data.id,
                name: data.name
            };
        } catch {
            return null;
        }
    };
}

/**
 * Gets default options for a field (for selected value in edit/view mode)
 * @param {string} fieldName - The field name
 * @param {Object} oldData - The old data object
 * @param {string} language - Current language
 * @returns {Array|boolean} Default options array or true for load on open
 */
/** Get a nested value from obj by path e.g. 'manager.nationality_id'. Exported for use in InputRFH. */
export function getNestedValue(obj, path) {
    if (!obj || !path) return undefined;
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
}

export function getDefaultOptionsForField(fieldName, oldData, language = 'en') {
    // Try to get the selected value from oldData (supports nested paths e.g. manager.nationality_id)
    const fieldValue = getNestedValue(oldData, fieldName) ?? oldData?.[fieldName];
    
    if (!fieldValue) {
        return true; // Load options on open
    }
    
    // Try to find the full object (e.g. nationality from nationality_id, or manager.nationality from manager.nationality_id)
    const objectPath = fieldName.replace(/_id$/, '');
    const fieldObject = getNestedValue(oldData, objectPath) ||
                       oldData?.[fieldName.replace('_id', '')] ||
                       oldData?.[fieldName] ||
                       null;
    
    if (fieldObject && typeof fieldObject === 'object' && fieldObject.id != null) {
        const name = fieldObject.name?.[language] ||
                    fieldObject.name?.en ||
                    fieldObject.name?.ar ||
                    fieldObject.name ||
                    '';
        
        return [{
            label: name,
            value: fieldObject.id
        }];
    }
    
    // If we only have the ID, return true to load on open
    return true;
}

