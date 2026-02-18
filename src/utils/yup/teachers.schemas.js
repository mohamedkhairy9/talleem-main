import * as yup from 'yup';
import { t } from 'i18next';

export const teachersSchema = yup.object({
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
    gender: yup
        .string()
        .required(t('validation.required'))
        .oneOf(['male', 'female'], t('validation.invalid_gender')),

    registration_date: yup
        .string()
        .required(t('validation.required'))
        .test('is-valid-date', t('validation.invalid_date'), value => {
            if (!value) return false;
            const date = new Date(value);
            return date <= new Date(); // تاريخ الانضمام لازم يكون في الماضي أو النهاردة
        }),

    // UPDATED: Status accepts 'active', 'cancelled', 'unauthorized'
    status: yup
        .string()
        .required(t('validation.required'))
        .oneOf(['active', 'cancelled', 'unauthorized'], t('validation.status.invalid')),

    entry_type: yup
        .string()
        .required(t('validation.required'))
        .oneOf(['new_with_approval', 'active_with_license'], t('validation.required')),

    city_id: yup
        .number()
        .required(t('validation.required'))
        .integer(t('validation.city_id.integer'))
        .min(1, t('validation.city_id.min')),

    branch_id: yup
        .number()
        .required(t('validation.required'))
        .integer(t('validation.branch_id.integer'))
        .min(1, t('validation.branch_id.min')),

    main_program_id: yup
        .number()
        .required(t('validation.required'))
        .integer(t('validation.main_program_id.integer'))
        .min(1, t('validation.main_program_id.min')),

    entity_id: yup
        .number()
        .required(t('validation.required'))
        .integer(t('validation.entity_id.integer'))
        .min(1, t('validation.entity_id.min')),

    // Classification is a text string
    education_program_entity_type_classification: yup
        .string()
        .nullable()
        .when('main_program_id', {
            is: value => Number(value) === 1,
            then: schema =>
                schema
                    // .required(t('validation.required'))
                    .min(2, t('validation.education_program_entity_type_classification.min')),
            otherwise: schema => schema.optional()
        }),

    // Entity category is a number ID
    entity_category_id: yup
        .number()
        .nullable()
        .when('main_program_id', {
            is: value => [1, 2].includes(Number(value)),
            then: schema =>
                schema
                    // .required(t('validation.required'))
                    .integer(t('validation.entity_category_id.integer'))
                    .min(1, t('validation.entity_category_id.min')),
            otherwise: schema => schema.optional()
        }),

    major_id: yup
        .number()
        .nullable()
        .optional()
        .integer(t('validation.major_id.integer'))
        .min(1, t('validation.major_id.min')),

    licence_number: yup
        .string()
        .nullable()
        .when('entry_type', {
            is: 'active_with_license',
            then: schema => schema
        .required(t('validation.required'))
        .min(3, t('validation.licence_number.min'))
        .max(50, t('validation.licence_number.max')),
            otherwise: schema => schema.nullable().optional()
        }),
    license_image: yup
        .mixed()
        .nullable()
        .when('entry_type', {
            is: 'active_with_license',
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
            is: 'active_with_license',
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

    nationality_id: yup
        .number()
        .required(t('validation.required'))
        .integer(t('validation.nationality_id.integer'))
        .min(1, t('validation.nationality_id.min')),

    academic_qualification_id: yup
        .number()
        .nullable()
        .optional()
        .integer(t('validation.academic_qualification_id.integer'))
        .min(1, t('validation.academic_qualification_id.min')),

    dob: yup.string().required(t('validation.dob.required')),

    years_of_experience: yup
        .number()
        .nullable()
        .transform((value, originalValue) => 
            originalValue === '' || originalValue === null || originalValue === undefined || isNaN(originalValue) ? null : value
        )
        .optional()
        .integer(t('validation.years_of_experience.integer'))
        .min(0, t('validation.years_of_experience.min')),

    memorization_amount: yup
        .string()
        .required(t('validation.required'))
        .min(1, t('validation.memorization_amount.min'))
        .max(50, t('validation.memorization_amount.max')),

    national_id: yup
        .string()
        .required(t('validation.required'))
        .matches(/^[0-9]+$/, t('validation.national_id.numeric'))
        .min(10, t('validation.national_id.min'))
        .max(20, t('validation.national_id.max')),

    phone: yup
        .string()
        .required(t('validation.required'))
        .matches(/^[+]?[0-9]+$/, t('validation.phone.invalid')),

    email: yup
        .string()
        .required(t('validation.required'))
        .email(t('validation.email.invalid')),

    address: yup
        .string()
        .nullable()
        .transform((value) => (value === '' ? null : value))
        .optional()
        .test('min-length', t('validation.address.min'), function(value) {
            if (!value || value === '') return true; // Allow empty values
            return value.length >= 5;
        }),

    files: yup.array().of(yup.mixed()).nullable().optional(),

    profile_image: yup.mixed().nullable().optional()
});

// Edit mode: entry_type is hidden and not required
export const teachersSchemaEdit = teachersSchema.shape({
    entry_type: yup
        .string()
        .nullable()
        .optional()
        .oneOf(['new_with_approval', 'active_with_license'], t('validation.required'))
});