import * as yup from 'yup';
import { t } from 'i18next';
import { selectSchema } from './globals.schemas';

export const employeesSchema = yup.object({
    name: yup
        .object({
            en: yup.string().required(t('validation.required')).min(1),
            ar: yup.string().required(t('validation.required')).min(1)
        })
        .required(t('validation.required')),
    job_id: selectSchema,
    branch_id: selectSchema,
    entity_id: selectSchema,
    nationality_id: selectSchema,
    academic_qualification_id: selectSchema,
    specification_id: selectSchema,
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
        .string()
        .required(t('validation.date_of_birth.required')),
    city_id: selectSchema,
    years_of_experience: yup.string().optional().nullable(),
    address: yup
        .string()
        .required(t('validation.required'))
        .min(5, t('validation.address.min')),
    status: yup.boolean().required(t('validation.required')),
    profile_picture: yup.mixed().nullable().optional(),
    files: yup.array().of(yup.mixed()).nullable().optional()
});
