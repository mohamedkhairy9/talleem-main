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
    program_entity_types: selectSchema,
    main_program_id: selectSchema,
    city_id: selectSchema,
    entity_category_id: selectSchema,
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
    lecture_holes_count: yup.string().optional().nullable(),
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
            academic_qualification_id: selectSchema,
            specification_id: selectSchema,
            date_of_birth: yup
                .string()
                .required(t('validation.date_of_birth.required')),
            address: yup.string().optional().nullable(),
            memorization_amount: yup.string().optional().nullable(),
            years_of_experience: yup.string().optional().nullable(),
            files: yup.array().of(yup.mixed()).nullable().optional(),
            profile_image: yup.mixed().nullable().optional()
        })
        .nullable()
        .optional()
});
