import * as yup from 'yup';
import { t } from 'i18next';

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
    status: yup
        .string()
        .oneOf(['active', 'inactive'], t('validation.status.invalid'))
        .required(t('validation.required')),
    program_entity_types: yup.string().required(t('validation.required')),
    main_program_id: yup
        .number()
        .required(t('validation.required'))
        .integer(t('validation.main_program_id.integer'))
        .min(1, t('validation.main_program_id.min')),
    city_id: yup
        .number()
        .required(t('validation.required'))
        .integer(t('validation.city_id.integer'))
        .min(1, t('validation.city_id.min')),
    entity_category_id: yup
        .number()
        .required(t('validation.required'))
        .integer(t('validation.entity_category_id.integer'))
        .min(1, t('validation.entity_category_id.min')),
    neighborhood_id: yup
        .number()
        .required(t('validation.required'))
        .integer(t('validation.neighborhood_id.integer'))
        .min(1, t('validation.neighborhood_id.min')),
    location_type_id: yup
        .number()
        .required(t('validation.required'))
        .integer(t('validation.location_type_id.integer'))
        .min(1, t('validation.location_type_id.min')),
    min_acceptance_age: yup
        .number()
        .typeError(t('validation.min_acceptance_age.integer'))
        .required(t('validation.required'))
        .integer(t('validation.min_acceptance_age.integer'))
        .min(1, t('validation.min_acceptance_age.min'))
        .max(100, t('validation.min_acceptance_age.max')),
    branch_id: yup
        .number()
        .required(t('validation.required'))
        .integer(t('validation.branch_id.integer'))
        .min(1, t('validation.branch_id.min')),
    address: yup.string().optional(),
    phone: yup
        .string()
        .required(t('validation.required'))
        .matches(/^[+]?[0-9]+$/, t('validation.phone.invalid')),
    email: yup.string().email(t('validation.email.invalid')),
    area: yup.string().optional(),
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
    class_count: yup
        .string().optional(),
    management_rooms_count: yup.string().optional(),
    lecture_holes_count: yup.string().optional(),
    files: yup.array().of(yup.mixed()).nullable().optional(),
    registration_date: yup.string().required(t('validation.required')),
    license_number: yup.string().required(t('validation.required')),
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
                .nullable()
                .optional()
                .email(t('validation.email.invalid')),
            manager_phone: yup
                .string()
                .required(t('validation.required'))
                .matches(/^[+]?[0-9]+$/, t('validation.phone.invalid')),
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
            city_id: yup
                .number()
                .required(t('validation.required'))
                .integer(t('validation.city_id.integer'))
                .min(1, t('validation.city_id.min')),
            academic_level_id: yup
                .number()
                .required(t('validation.required'))
                .integer(t('validation.academic_level_id.integer'))
                .min(1, t('validation.academic_level_id.min')),
            specification_id: yup
                .number()
                .integer(t('validation.specification_id.integer'))
                .min(1, t('validation.specification_id.min')),
            date_of_birth: yup
                .string()
                .required(t('validation.date_of_birth.required')),
            address: yup.string().optional(),
            memorization_amount: yup.string().optional(),
            years_of_experience: yup.string().optional(),
            files: yup.array().of(yup.mixed()).nullable().optional(),
            profile_image: yup.mixed().nullable().optional()
        })
        .nullable()
        .optional()
});
