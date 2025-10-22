import * as yup from 'yup';
import { t } from 'i18next';

export const countriesSchema = yup.object().shape({
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
    short_name: yup
        .string()
        .required(t('validation.required'))
        .min(2, t('validation.short_name.min'))
        .max(10, t('validation.short_name.max')),
    phone_code: yup
        .string()
        .required(t('validation.required'))
        .matches(/^\+\d+$/, t('validation.phone_code.pattern')),
    status: yup.boolean().required(t('validation.required'))
});
