import * as yup from 'yup';
import { t } from 'i18next';

export const entityManagersSchema = yup.object({
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
    entity_id: yup
        .number()
        .required(t('validation.required'))
        .integer(t('validation.entity_id.integer'))
        .min(1, t('validation.entity_id.min')),
    nationality_id: yup
        .number()
        .required(t('validation.required'))
        .integer(t('validation.nationality_id.integer'))
        .min(1, t('validation.nationality_id.min')),
    branch_id: yup
        .number()
        .required(t('validation.required'))
        .integer(t('validation.branch_id.integer'))
        .min(1, t('validation.branch_id.min')),
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
        .required(t('validation.required'))
        .integer(t('validation.specification_id.integer'))
        .min(1, t('validation.specification_id.min')),
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
    date_of_birth: yup
        .string()
        .required(t('validation.date_of_birth.required')),
    years_of_experience: yup
        .number()
        .required(t('validation.required'))
        .integer(t('validation.years_of_experience.integer'))
        .min(0, t('validation.years_of_experience.min')),
    manager_phone: yup
        .string()
        .required(t('validation.required'))
        .matches(/^[+]?[0-9]+$/, t('validation.phone.invalid')),
    manager_email: yup
        .string()
        .required(t('validation.required'))
        .email(t('validation.email.invalid')),
    memorization_amount: yup
        .string()
        .required(t('validation.required'))
        .min(1, t('validation.memorization_amount.min'))
        .max(50, t('validation.memorization_amount.max')),
    address: yup
        .string()
        .required(t('validation.required'))
        .min(5, t('validation.address.min')),
    files: yup.array().of(yup.mixed()).nullable().optional(),
    profile_image: yup.mixed().nullable().optional()
});
