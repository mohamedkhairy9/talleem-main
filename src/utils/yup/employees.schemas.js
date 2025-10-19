import * as yup from 'yup';
import { t } from 'i18next';

export const employeesSchema = yup.object({
    user_id: yup
        .number()
        .required(t('validation.required'))
        .integer(t('validation.user_id.integer'))
        .min(1, t('validation.user_id.min')),
    job_id: yup
        .number()
        .required(t('validation.required'))
        .integer(t('validation.job_id.integer'))
        .min(1, t('validation.job_id.min')),
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
    phone: yup
        .string()
        .required(t('validation.required'))
        .matches(/^[+]?[0-9]+$/, t('validation.phone.invalid')),
    email: yup
        .string()
        .required(t('validation.required'))
        .email(t('validation.email.invalid')),
    date_of_birth: yup
        .date()
        .required(t('validation.date_of_birth.required'))
        .typeError(t('validation.date_of_birth.invalid')),
    city_id: yup
        .number()
        .required(t('validation.required'))
        .integer(t('validation.city_id.integer'))
        .min(1, t('validation.city_id.min')),
    years_of_experience: yup
        .number()
        .required(t('validation.required'))
        .integer(t('validation.years_of_experience.integer'))
        .min(0, t('validation.years_of_experience.min')),
    address: yup
        .string()
        .required(t('validation.required'))
        .min(5, t('validation.address.min')),
    status: yup
        .boolean()
        .required(t('validation.required'))
});

