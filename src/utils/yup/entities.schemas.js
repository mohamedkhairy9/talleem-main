import * as yup from 'yup';
import { t } from 'i18next';

export const entitiesSchema = yup.object({
    user_id: yup
        .number()
        .required(t('validation.required'))
        .integer(t('validation.user_id.integer'))
        .min(1, t('validation.user_id.min')),
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
    address: yup
        .string()
        .required(t('validation.required'))
        .min(5, t('validation.address.min')),
    phone: yup
        .string()
        .required(t('validation.required'))
        .matches(/^[+]?[0-9]+$/, t('validation.phone.invalid')),
    email: yup
        .string()
        .required(t('validation.required'))
        .email(t('validation.email.invalid')),
    area: yup
        .string()
        .required(t('validation.required'))
        .min(2, t('validation.area.min'))
        .max(100, t('validation.area.max')),
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
        .number()
        .typeError(t('validation.class_count.integer'))
        .required(t('validation.required'))
        .integer(t('validation.class_count.integer'))
        .min(0, t('validation.class_count.min')),
    management_rooms_count: yup
        .number()
        .typeError(t('validation.management_rooms_count.integer'))
        .required(t('validation.required'))
        .integer(t('validation.management_rooms_count.integer'))
        .min(0, t('validation.management_rooms_count.min')),
    lecture_holes_count: yup
        .number()
        .typeError(t('validation.lecture_holes_count.integer'))
        .required(t('validation.required'))
        .integer(t('validation.lecture_holes_count.integer'))
        .min(0, t('validation.lecture_holes_count.min')),
    activities: yup
        .array()
        .of(
            yup.object({
                main_program_id: yup
                    .number()
                    .required(t('validation.required'))
                    .integer(t('validation.main_program_id.integer'))
                    .min(1, t('validation.main_program_id.min')),
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
                    .required(t('validation.required'))
            })
        )
        .min(1, t('validation.activities.min'))
        .required(t('validation.required')),
    files: yup.array().of(yup.mixed()).nullable().optional()
});
