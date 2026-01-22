import * as yup from 'yup';
import { t } from 'i18next';
import { selectSchema } from './globals.schemas';

export const entitiesSchema = yup.object({
    name: yup
        .object({
            en: yup
                .string()
                .required(t('validation.required'))
                .min(2, t('validation.name.en_min'))
                .max(100, t('validation.name.en_max')),
            ar: yup
                .string()
                .required(t('validation.required'))
                .min(2, t('validation.name.ar_min'))
                .max(100, t('validation.name.ar_max'))
        })
        .required(t('validation.required')),
    status: selectSchema,
    main_program_id: selectSchema,
    session_mode_id: yup
        .number()
        .required(t('validation.required'))
        .positive(t('validation.required')),
    education_program_entity_type_classification: yup
        .string()
        .nullable()
        .when('main_program_id', {
            // main_program_id comes as string from selects; coerce safely
            is: value => Number(value) === 1,
            then: schema => schema.required(t('validation.required')),
            otherwise: schema => schema.optional()
        }),
    entity_category_id: yup
        .string()
        .nullable()
        .when('main_program_id', {
            is: value => [1, 2].includes(Number(value)),
            then: schema =>
                schema
                    .required(t('validation.required'))
                    .min(1, t('validation.select.min')),
            otherwise: schema => schema.optional()
        }),
    city_id: selectSchema,
    neighborhood_id: selectSchema,
    location_type_id: selectSchema,
    branch_id: selectSchema,

    min_acceptance_age: yup
        .number()
        .typeError(t('validation.min_acceptance_age.integer'))
        .required(t('validation.required'))
        .integer(t('validation.min_acceptance_age.integer'))
        .min(1, t('validation.min_acceptance_age.min'))
        .max(100, t('validation.min_acceptance_age.max')),
    address: yup.string().optional().nullable(),
    phone: yup
        .string()
        .required(t('validation.required'))
        .matches(/^[+]?[0-9]+$/, t('validation.phone.invalid')),
    email: yup.string().email(t('validation.email.invalid')),
    area: yup.string().optional().nullable(),
    latitude: yup
        .number()
        .typeError(t('validation.latitude.invalid'))
        .required(t('validation.required'))
        .min(-90, t('validation.latitude.min'))
        .max(90, t('validation.latitude.max')),
    longitude: yup
        .number()
        .typeError(t('validation.longitude.invalid'))
        .required(t('validation.required'))
        .min(-180, t('validation.longitude.min'))
        .max(180, t('validation.longitude.max')),
    class_count: yup.string().optional().nullable(),
    management_rooms_count: yup.string().optional().nullable(),
    lecture_halls_count: yup.string().optional().nullable(),
    files: yup.array().of(yup.mixed()).nullable().optional(),
    registration_date: yup.string().required(t('validation.required')),
    entry_type: yup
        .string()
        .required(t('validation.required'))
        .oneOf(['new_with_approval', 'new_with_license'], t('validation.required')),
    license_number: yup
        .string()
        .nullable()
        .when('entry_type', {
            is: 'new_with_license',
            then: schema => schema.required(t('validation.required')),
            otherwise: schema => schema.nullable().optional()
        }),
    license_image: yup
        .mixed()
        .nullable()
        .when('entry_type', {
            is: 'new_with_license',
            then: schema => schema
                .required(t('validation.required'))
                .test('is-file', t('validation.license_image.must_be_file'), function(value) {
                    if (!value) return false;
                    // In edit mode, value might be a URL string (existing file)
                    if (typeof value === 'string') return true;
                    // Handle File object
                    if (value instanceof File) return true;
                    // Handle FileList
                    if (value instanceof FileList && value.length > 0) return true;
                    // Handle array of Files
                    if (Array.isArray(value) && value.length > 0 && value[0] instanceof File) return true;
                    return false;
                })
                .test('is-valid-file-type', t('validation.license_image.file_type'), function(value) {
                    if (!value) return true;
                    // In edit mode, value might be a URL string (existing file)
                    if (typeof value === 'string') return true;
                    
                    let file = null;
                    // Handle File object
                    if (value instanceof File) {
                        file = value;
                    }
                    // Handle FileList
                    else if (value instanceof FileList && value.length > 0) {
                        file = value[0];
                    }
                    // Handle array of Files
                    else if (Array.isArray(value) && value.length > 0 && value[0] instanceof File) {
                        file = value[0];
                    }
                    
                    if (file && file instanceof File) {
                        const fileName = file.name.toLowerCase();
                        const validExtensions = ['.jpg', '.jpeg', '.png', '.pdf'];
                        const fileExtension = fileName.substring(fileName.lastIndexOf('.'));
                        return validExtensions.includes(fileExtension);
                    }
                    
                    return false;
                }),
            otherwise: schema => schema.nullable().optional()
        }),
    license_issue_date: yup
        .string()
        .nullable()
        .when('entry_type', {
            is: 'new_with_license',
            then: schema => schema
                .required(t('validation.required'))
                .test('is-valid-date', t('validation.invalid_date'), value => {
                    if (!value) return false;
                    const date = new Date(value);
                    return !isNaN(date.getTime());
                })
                .test('is-past-or-today', t('validation.license_issue_date.past_or_today'), value => {
                    if (!value) return true;
                    const selectedDate = new Date(value);
                    selectedDate.setHours(0, 0, 0, 0);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return selectedDate <= today;
                }),
            otherwise: schema => schema.nullable().optional()
        }),
    license_expiration_date: yup
        .string()
        .nullable()
        .when('entry_type', {
            is: 'new_with_license',
            then: schema => schema
                .test('is-valid-date', t('validation.invalid_date'), function(value) {
                    if (!value) return true; // Optional field
                    const date = new Date(value);
                    return !isNaN(date.getTime());
                })
                .test('is-future-date', t('validation.license_expiration_date.future'), function(value) {
                    if (!value) return true; // Optional field
                    const selectedDate = new Date(value);
                    selectedDate.setHours(0, 0, 0, 0);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return selectedDate > today;
                })
                .test('is-after-issue-date', t('validation.license_expiration_date.after_issue'), function(value) {
                    if (!value) return true; // Optional field
                    const { license_issue_date } = this.parent;
                    if (!license_issue_date) return true;
                    const expirationDate = new Date(value);
                    const issueDate = new Date(license_issue_date);
                    expirationDate.setHours(0, 0, 0, 0);
                    issueDate.setHours(0, 0, 0, 0);
                    return expirationDate > issueDate;
                }),
            otherwise: schema => schema.nullable().optional()
        }),
    manager: yup
        .object({
            name: yup
                .object({
                    en: yup
                        .string()
                        .required(t('validation.required'))
                        .min(2, t('validation.name.en_min'))
                        .max(100, t('validation.name.en_max')),
                    ar: yup
                        .string()
                        .required(t('validation.required'))
                        .min(2, t('validation.name.ar_min'))
                        .max(100, t('validation.name.ar_max'))
                })
                .required(t('validation.required')),
            manager_email: yup
                .string()
                .email(t('validation.email.invalid'))
                .required(t('validation.required')),
            manager_phone: yup
                .string()
                .matches(/^[+]?[0-9]+$/, t('validation.phone.invalid'))
                .required(t('validation.required')),
            national_id: yup
                .string()
                .required(t('validation.required'))
                .matches(/^[0-9]+$/, t('validation.national_id.numeric'))
                .min(10, t('validation.national_id.min'))
                .max(20, t('validation.national_id.max')),
            gender: yup
                .string()
                .required(t('validation.required'))
                .oneOf(['male', 'female'], t('validation.gender.invalid')),
            nationality_id: yup
                .number()
                .required(t('validation.required'))
                .integer(t('validation.nationality_id.integer'))
                .min(1, t('validation.nationality_id.min')),
            city_id: selectSchema,
            academic_qualification_id: yup
                .number()
                .nullable()
                .optional()
                .integer(t('validation.academic_qualification_id.integer'))
                .min(1, t('validation.academic_qualification_id.min')),
            specification_id: yup
                .number()
                .nullable()
                .optional()
                .integer(t('validation.specification_id.integer'))
                .min(1, t('validation.specification_id.min')),
            date_of_birth: yup
                .string()
                .required(t('validation.date_of_birth.required')),
            address: yup
                .string()
                .nullable()
                .transform((value) => (value === '' ? null : value))
                .optional(),
            memorization_amount: yup.string().optional().nullable(),
            years_of_experience: yup.string().optional().nullable(),
            files: yup.array().of(yup.mixed()).nullable().optional(),
            profile_image: yup.mixed().nullable().optional()
        })
        .nullable()
        .optional()
});
