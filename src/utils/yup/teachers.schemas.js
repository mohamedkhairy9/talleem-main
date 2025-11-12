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
    
    // UPDATED: Status accepts 'active', 'canceled', 'unauthorized'
    status: yup
        .string()
        .required(t('validation.required'))
        .oneOf(['active', 'canceled', 'unauthorized'], t('validation.status.invalid')),
    
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
                    .required(t('validation.required'))
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
                    .required(t('validation.required'))
                    .integer(t('validation.entity_category_id.integer'))
                    .min(1, t('validation.entity_category_id.min')),
            otherwise: schema => schema.optional()
        }),
    
    major_id: yup
        .number()
        .required(t('validation.required'))
        .integer(t('validation.major_id.integer'))
        .min(1, t('validation.major_id.min')),
    
    licence_number: yup
        .string()
        .required(t('validation.required'))
        .min(3, t('validation.licence_number.min'))
        .max(50, t('validation.licence_number.max')),
    
    nationality_id: yup
        .number()
        .required(t('validation.required'))
        .integer(t('validation.nationality_id.integer'))
        .min(1, t('validation.nationality_id.min')),
    
    academic_qualification_id: yup
        .number()
        .required(t('validation.required'))
        .integer(t('validation.academic_qualification_id.integer'))
        .min(1, t('validation.academic_qualification_id.min')),
    
    dob: yup.string().required(t('validation.dob.required')),
    
    years_of_experience: yup
        .number()
        .required(t('validation.required'))
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
        .required(t('validation.required'))
        .min(5, t('validation.address.min')),
    
    files: yup.array().of(yup.mixed()).nullable().optional(),
    
    profile_image: yup.mixed().nullable().optional()
});