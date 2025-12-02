import * as yup from 'yup';
import { t } from 'i18next';

export const usersSchema = yup.object().shape({
    name: yup
        .object({
            en: yup
                .string()
                .required(t('validation.required'))
                .min(2, t('validation.name.en_min')),
            ar: yup
                .string()
                .required(t('validation.required'))
                .min(2, t('validation.name.ar_min'))
        })
        .required(t('validation.required')),
    email: yup
        .string()
        .required(t('validation.required'))
        .email(t('validation.email.invalid')),
    password: yup
        .string()
        .required(t('validation.required'))
        .min(6, t('validation.password.min')),
    phone: yup.string().required(t('validation.required')),
    branch_id: yup
        .number()
        .required(t('validation.required'))
        .integer(t('validation.branch_id.integer'))
        .min(1, t('validation.branch_id.min')),
    user_type: yup
        .string()
        .required(t('validation.required'))
        .oneOf(['student', 'teacher', 'entity', 'guest', 'employee', 'super-admin', 'parent'], t('validation.user_type.invalid')),
});
