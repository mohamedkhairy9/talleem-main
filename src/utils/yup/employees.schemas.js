import * as yup from 'yup';
import { t } from 'i18next';
import { optionalSelectSchema, selectSchema } from './globals.schemas';

export const employeesSchema = yup.object({
    name: yup
        .object({
            en: yup.string().required(t('validation.required')).min(1),
            ar: yup.string().required(t('validation.required')).min(1)
        })
        .required(t('validation.required')),
    job_id: selectSchema,
    // branch can be single (most jobs) or multi-select (branch manager); allow both shapes
    branch_id: yup
        .mixed()
        .nullable()
        .optional(),
    entity_id: optionalSelectSchema,
    nationality_id: selectSchema,
    academic_qualification_id: yup.number().nullable().optional().integer(),
    // specification_id: selectSchema,
    major_id: yup
        .number()
        .nullable()
        .optional()
        // .required(t('validation.required'))
        .integer(t('validation.major_id.integer')),
        // .min(1, t('validation.major_id.min')),
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
        .required(t('validation.date_of_birth.required'))
        .test('is-min-age-18', t('validation.date_of_birth.min_age_18'), value => {
            if (!value) return true;
            const birthDate = new Date(value);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            return age >= 18;
        }),
    city_id: selectSchema,
    years_of_experience: yup.string().optional().nullable(),
    address: yup
        .string()
        .nullable()
        .transform((value) => (value === '' ? null : value))
        .optional()
        .test('min-length', t('validation.address.min'), function(value) {
            if (!value || value === '') return true; // Allow empty values
            return value.length >= 5;
        }),
    status: yup.boolean().required(t('validation.required')),
    roles: yup.array().of(yup.number().integer()).nullable().optional(),
    profile_picture: yup.mixed().optional().nullable(),
    files: yup.array().of(yup.mixed()).nullable().optional()
});
