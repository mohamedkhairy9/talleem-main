import * as yup from 'yup';
import { t } from 'i18next';

export const citiesSchema = yup.object({
    name: yup
        .object({
            en: yup.string().required(t('validation.required')).min(1),
            ar: yup.string().required(t('validation.required')).min(1)
        })
        .required(t('validation.required')),
    country_id: yup
        .number()
        .required(t('validation.required'))
        .integer(t('validation.country_id.integer'))
        .min(1, t('validation.country_id.min')),
    status: yup.boolean().required(t('validation.required'))
});
