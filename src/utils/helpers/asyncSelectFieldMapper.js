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
import { entityCategoriesService } from '@/api/services/entityCategories.service';
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
 * Maps field names to their corresponding API service methods
 * This allows automatic async select configuration for API-backed fields
 */
export const FIELD_TO_SERVICE_MAP = {
    // Nationalities
    nationality_id: {
        service: nationalitiesService.getNationalities,
        serviceName: 'nationalitiesService.getNationalities'
    },
    
    // Cities
    city_id: {
        service: citiesService.getCities,
        serviceName: 'citiesService.getCities'
    },
    
    // Branches
    branch_id: {
        service: branchesService.getBranches,
        serviceName: 'branchesService.getBranches'
    },
    
    // Entities
    entity_id: {
        service: entitiesService.getEntities,
        serviceName: 'entitiesService.getEntities'
    },
    
    // Main Programs
    main_program_id: {
        service: mainProgramsService.getMainPrograms,
        serviceName: 'mainProgramsService.getMainPrograms'
    },
    
    // Academic Qualifications
    academic_qualification_id: {
        service: academicQualificationsService.getAcademicQualifications,
        serviceName: 'academicQualificationsService.getAcademicQualifications'
    },
    
    // Majors
    major_id: {
        service: majorsService.getMajors,
        serviceName: 'majorsService.getMajors'
    },
    
    // Academic Levels
    academic_level_id: {
        service: academicLevelsService.getAcademicLevels,
        serviceName: 'academicLevelsService.getAcademicLevels'
    },
    
    // Specifications
    specification_id: {
        service: specificationsService.getSpecifications,
        serviceName: 'specificationsService.getSpecifications'
    },
    
    // Neighborhoods
    neighborhood_id: {
        service: neighborhoodsService.getNeighborhoods,
        serviceName: 'neighborhoodsService.getNeighborhoods'
    },
    
    // Location Types
    location_type_id: {
        service: locationTypesService.getLocationTypes,
        serviceName: 'locationTypesService.getLocationTypes'
    },
    
    // Session Modes
    session_mode_id: {
        service: sessionModesService.getSessionModes,
        serviceName: 'sessionModesService.getSessionModes'
    },
    
    // Education Program Entity Types
    education_program_entity_type_id: {
        service: educationProgramEntityTypesService.getEducationProgramEntityTypes,
        serviceName: 'educationProgramEntityTypesService.getEducationProgramEntityTypes'
    },
    
    // Memorization Program Entity Types
    memorization_program_entity_type_id: {
        service: memorizationProgramEntityTypesService.getMemorizationProgramEntityTypes,
        serviceName: 'memorizationProgramEntityTypesService.getMemorizationProgramEntityTypes'
    },
    
    // Entity Categories
    entity_category_id: {
        service: entityCategoriesService.getEntityCategories,
        serviceName: 'entityCategoriesService.getEntityCategories'
    },
    
    // Activities
    activity_ids: {
        service: activitiesService.getActivities,
        serviceName: 'activitiesService.getActivities'
    },
    
    // Users
    user_id: {
        service: usersService.getUsers,
        serviceName: 'usersService.getUsers'
    },
    
    // Students
    student_id: {
        service: studentsService.getStudents,
        serviceName: 'studentsService.getStudents'
    },
    
    // Teachers
    teacher_id: {
        service: teachersService.getTeachers,
        serviceName: 'teachersService.getTeachers'
    },
    
    // Employees
    employee_id: {
        service: employeesService.getEmployees,
        serviceName: 'employeesService.getEmployees'
    },
    
    // Roles
    role_id: {
        service: rolesService.getRoles,
        serviceName: 'rolesService.getRoles'
    },
    
    // Warning Reasons
    warning_reason_id: {
        service: warningReasonsService.getWarningReasons,
        serviceName: 'warningReasonsService.getWarningReasons'
    },
    
    // Join Request Forms
    join_request_form_id: {
        service: joinRequestFormsService.getJoinRequestForms,
        serviceName: 'joinRequestFormsService.getJoinRequestForms'
    },
    
    // Countries
    country_id: {
        service: countriesService.getCountries,
        serviceName: 'countriesService.getCountries'
    },
    
    // Jobs
    job_id: {
        service: jobsService.getJobs,
        serviceName: 'jobsService.getJobs'
    },
    
    // Kinships
    kinship_id: {
        service: kinshipsService.getKinships,
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
 * Creates async loadOptions for a field
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
 * Gets default options for a field (for selected value in edit/view mode)
 * @param {string} fieldName - The field name
 * @param {Object} oldData - The old data object
 * @param {string} language - Current language
 * @returns {Array|boolean} Default options array or true for load on open
 */
export function getDefaultOptionsForField(fieldName, oldData, language = 'en') {
    // Try to get the selected value from oldData
    const fieldValue = oldData?.[fieldName];
    
    if (!fieldValue) {
        return true; // Load options on open
    }
    
    // Try to find the full object (some fields store the full object)
    const fieldObject = oldData?.[fieldName.replace('_id', '')] || 
                       oldData?.[fieldName] ||
                       null;
    
    if (fieldObject && typeof fieldObject === 'object' && fieldObject.id) {
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

