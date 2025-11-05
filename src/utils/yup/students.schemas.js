import * as yup from 'yup';
import { t } from 'i18next';

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
    education_program_entity_type_id: yup
        .number()
        .required(t('validation.required'))
        .integer(t('validation.education_program_entity_type_id.integer'))
        .min(1, t('validation.education_program_entity_type_id.min')),
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
    // entity_category_id: yup
    //     .number()
    //     .required(t('validation.required'))
    //     .integer(t('validation.entity_category_id.integer'))
    //     .min(1, t('validation.entity_category_id.min')),
    status: yup.boolean().required(t('validation.required')),
    national_id: yup
        .string()
        .required(t('validation.required'))
        .matches(/^[0-9]+$/, t('validation.national_id.numeric'))
        .min(10, t('validation.national_id.min'))
        .max(20, t('validation.national_id.max')),
    nationality_id: yup
        .number()
        .required(t('validation.required'))
        .integer(t('validation.nationality_id.integer'))
        .min(1, t('validation.nationality_id.min')),
    school_name: yup
        .string()
        .required(t('validation.required'))
        .min(2, t('validation.school_name.min'))
        .max(100, t('validation.school_name.max')),
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
    parent_name: yup
        .string()
        .required(t('validation.required'))
        .min(2, t('validation.parent_name.min'))
        .max(100, t('validation.parent_name.max')),
    kinship_id: yup
        .number()
        .required(t('validation.required'))
        .integer(t('validation.kinship_id.integer'))
        .min(1, t('validation.kinship_id.min')),
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
    parent_phone_1: yup
        .string()
        .required(t('validation.required'))
        .matches(/^[+]?[0-9]+$/, t('validation.phone.invalid')),
    parent_phone_2: yup
        .string()
        .nullable()
        .matches(/^[+]?[0-9]*$/, t('validation.phone.invalid')),
    registration_date: yup.string().required(t('validation.required')),
    academic_level_id: yup
        .number()
        .required(t('validation.required'))
        .integer(t('validation.academic_level_id.integer'))
        .min(1, t('validation.academic_level_id.min')),
    gender: yup
        .string()
        .required(t('validation.required'))
        .oneOf(['male', 'female'], t('validation.gender.invalid')),
    phone: yup
        .string()
        .nullable()
        .matches(/^[+]?[0-9]*$/, t('validation.phone.invalid')),
    email: yup.string().nullable().email(t('validation.email.invalid')),
    // department: yup
    //     .object({
    //         en: yup
    //             .string()
    //             .nullable()
    //             .min(2, t('validation.department.en_min'))
    //             .max(100, t('validation.department.en_max')),
    //         ar: yup
    //             .string()
    //             .nullable()
    //             .min(2, t('validation.department.ar_min'))
    //             .max(100, t('validation.department.ar_max'))
    //     })
    //     .nullable(),
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
                    is: 1,
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
        .nullable(),
    files: yup.array().of(yup.mixed()).nullable().optional(),
    profile_picture: yup.mixed().required(t('validation.required'))
});
