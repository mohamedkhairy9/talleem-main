import * as yup from 'yup';
import { t } from 'i18next';

export const parentsSchema = yup.object({
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
    phone_1: yup
        .string()
        .required(t('validation.required'))
        .matches(/^\+?\d{10,15}$/, t('validation.phone_1.invalid')),
    phone_2: yup
        .string()
        .nullable()
        .optional()
        .matches(/^\+?\d{10,15}$/, t('validation.phone_2.invalid'))
});
