import * as yup from 'yup';
import { t } from 'i18next';

// Helper to calculate age
const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

export const studentsSchema = yup.object({
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
    main_program_id: yup
        .number()
        .required(t('validation.required'))
        .integer(t('validation.main_program_id.integer'))
        .min(1, t('validation.main_program_id.min')),
    
    // UPDATED: Classification is now a text string, not a number
    education_program_entity_type_classification: yup
        .string()
        .nullable()
        .transform((value) => (value === '' ? null : value))
        .when('main_program_id', {
            is: value => Number(value) === 1,
            then: schema =>
                schema
                    .required(t('validation.required'))
                    .min(2, t('validation.education_program_entity_type_classification.min')),
            otherwise: schema => schema.nullable().optional()
        }),
    
    // Entity category is now the education_program_entity_type_id
    entity_category_id: yup
        .number()
        .nullable()
        .transform((value, originalValue) => 
            originalValue === '' || originalValue === null || originalValue === undefined ? null : value
        )
        .when('main_program_id', {
            is: value => Number(value) === 1,
            then: schema =>
                schema
                    .required(t('validation.required'))
                    .integer(t('validation.entity_category_id.integer'))
                    .min(1, t('validation.entity_category_id.min')),
            otherwise: schema => schema.nullable().optional()
        }),
    
    branch_id: yup
        .number()
        .required(t('validation.required'))
        .integer(t('validation.branch_id.integer'))
        .min(1, t('validation.branch_id.min')),
    
    entity_id: yup
        .number()
        .required(t('validation.required'))
        .integer(t('validation.entity_id.integer'))
        .min(1, t('validation.entity_id.min')),
    
    status: yup.boolean().required(t('validation.required')),
    
    national_id: yup
        .string()
        .required(t('validation.required'))
        .matches(/^[0-9]{11}$/, t('validation.national_id.exact_11_digits')),
    
    nationality_id: yup
        .number()
        .required(t('validation.required'))
        .integer(t('validation.nationality_id.integer'))
        .min(1, t('validation.nationality_id.min')),
    
    school_name: yup
        .string()
        .nullable()
        .when('main_program_id', {
            is: value => Number(value) === 2,
            then: schema =>
                schema
                    .required(t('validation.required'))
                    .min(2, t('validation.school_name.min'))
                    .max(100, t('validation.school_name.max')),
            otherwise: schema => schema.nullable().optional()
        }),
    
    city_id: yup
        .number()
        .required(t('validation.required'))
        .integer(t('validation.city_id.integer'))
        .min(1, t('validation.city_id.min')),
    
    address: yup
        .string()
        .required(t('validation.required'))
        .min(5, t('validation.address.min')),
    
    date_of_birth: yup
        .string()
        .required(t('validation.date_of_birth.required')),
    
    // Parent name as bilingual object - required when age < 18
    parent_name: yup
        .object({
            en: yup
                .string()
                .nullable()
                .when('$date_of_birth', {
                    is: (dateOfBirth) => {
                        const age = calculateAge(dateOfBirth);
                        return age !== null && age < 18;
                    },
                    then: schema =>
                        schema
                            .required(t('validation.required'))
                            .min(2, t('validation.parent_name.en_min'))
                            .max(100, t('validation.parent_name.en_max')),
                    otherwise: schema => schema.nullable().optional()
                }),
            ar: yup
                .string()
                .nullable()
                .when('$date_of_birth', {
                    is: (dateOfBirth) => {
                        const age = calculateAge(dateOfBirth);
                        return age !== null && age < 18;
                    },
                    then: schema =>
                        schema
                            .required(t('validation.required'))
                            .min(2, t('validation.parent_name.ar_min'))
                            .max(100, t('validation.parent_name.ar_max')),
                    otherwise: schema => schema.nullable().optional()
                })
        })
        .nullable()
        .default({ en: '', ar: '' }),
    
    kinship_id: yup
        .number()
        .nullable()
        .when('date_of_birth', {
            is: (dateOfBirth) => {
                const age = calculateAge(dateOfBirth);
                return age !== null && age < 18;
            },
            then: schema =>
                schema
                    .required(t('validation.required'))
                    .integer(t('validation.kinship_id.integer'))
                    .min(1, t('validation.kinship_id.min')),
            otherwise: schema => schema.nullable().optional()
        }),
    
    parent_phone_1: yup
        .string()
        .nullable()
        .when('date_of_birth', {
            is: (dateOfBirth) => {
                const age = calculateAge(dateOfBirth);
                return age !== null && age < 18;
            },
            then: schema =>
                schema
                    .required(t('validation.required'))
                    .matches(/^[+]?[0-9]+$/, t('validation.phone.invalid')),
            otherwise: schema => schema.nullable().optional()
        }),
    
    parent_phone_2: yup
        .string()
        .nullable()
        .when('date_of_birth', {
            is: (dateOfBirth) => {
                const age = calculateAge(dateOfBirth);
                return age !== null && age < 18;
            },
            then: schema =>
                schema.matches(/^[+]?[0-9]*$/, t('validation.phone.invalid')),
            otherwise: schema => schema.nullable().optional()
        }),
    
    has_medical_issues: yup
        .number()
        .required(t('validation.required'))
        .oneOf([0, 1], t('validation.has_medical_issues.invalid')),
    
    issue_description: yup
        .string()
        .nullable()
        .when('has_medical_issues', {
            is: 1,
            then: schema =>
                schema
                    .required(t('validation.required'))
                    .min(5, t('validation.issue_description.min')),
            otherwise: schema => schema.nullable()
        }),
    
    registration_date: yup
        .string()
        .required(t('validation.required'))
        .test('is-past-date', t('validation.registration_date.past_only'), value => {
            if (!value) return true;
            const selectedDate = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return selectedDate < today;
        }),
    
    academic_level_id: yup
        .number()
        .nullable()
        .when('main_program_id', {
            is: value => Number(value) === 2,
            then: schema =>
                schema
                    .required(t('validation.required'))
                    .integer(t('validation.academic_level_id.integer'))
                    .min(1, t('validation.academic_level_id.min')),
            otherwise: schema => schema.nullable().optional()
        }),
    
    specification_id: yup
        .number()
        .required(t('validation.required'))
        .integer(t('validation.specification_id.integer'))
        .min(1, t('validation.specification_id.min')),
    
    gender: yup
        .string()
        .required(t('validation.required'))
        .oneOf(['male', 'female'], t('validation.gender.invalid')),
    
    phone: yup
        .string()
        .nullable()
        .matches(/^[+]?[0-9]*$/, t('validation.phone.invalid')),
    
    email: yup.string().nullable().email(t('validation.email.invalid')),
    
    qualification: yup
        .object({
            has_high_school: yup
                .number()
                .nullable()
                .oneOf(
                    [0, 1],
                    t('validation.qualification.has_high_school.invalid')
                ),
            high_school_grade: yup
                .number()
                .nullable()
                .typeError(
                    t('validation.qualification.high_school_grade.integer')
                )
                .min(0, t('validation.qualification.high_school_grade.min'))
                .max(100, t('validation.qualification.high_school_grade.max'))
                .when('has_high_school', {
                    is: 1,
                    then: schema => schema.required(t('validation.required')),
                    otherwise: schema => schema.nullable()
                }),
            has_bachelors_degree: yup
                .number()
                .nullable()
                .oneOf(
                    [0, 1],
                    t('validation.qualification.has_bachelors_degree.invalid')
                ),
            has_memorized_quran_5_parts: yup
                .number()
                .nullable()
                .oneOf(
                    [0, 1],
                    t(
                        'validation.qualification.has_memorized_quran_5_parts.invalid'
                    )
                ),
            memorized_quran_parts: yup
                .number()
                .nullable()
                .typeError(
                    t('validation.qualification.memorized_quran_parts.integer')
                )
                .integer(
                    t('validation.qualification.memorized_quran_parts.integer')
                )
                .min(0, t('validation.qualification.memorized_quran_parts.min'))
                .max(
                    30,
                    t('validation.qualification.memorized_quran_parts.max')
                )
                .when('has_memorized_quran_5_parts', {
                    is: 0,
                    then: schema => schema.required(t('validation.required')),
                    otherwise: schema => schema.nullable()
                }),
            major_id: yup
                .number()
                .nullable()
                .when('has_bachelors_degree', {
                    is: 1,
                    then: schema =>
                        schema.required(t('validation.required')).min(1),
                    otherwise: schema => schema.nullable()
                })
        })
        .nullable()
        .when('main_program_id', {
            is: value => Number(value) === 1,
            then: schema => schema.required(t('validation.required')),
            otherwise: schema => schema.nullable().optional()
        }),
    
    files: yup.array().of(yup.mixed()).nullable().optional(),
    
    profile_picture: yup.mixed().required(t('validation.required'))
});