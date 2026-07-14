import * as yup from 'yup';
import { t } from 'i18next';

export const loginSchema = yup.object({
    national_id: yup
        .string()
        .required(t('validation.required')),
    password: yup
        .string()
        .min(6, t('validation.password.min'))
        .required(t('validation.required'))
});
