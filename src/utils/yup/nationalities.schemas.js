import * as yup from 'yup';
import { t } from 'i18next';

export const nationalitiesSchema = yup.object().shape({
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
    country_id: yup
        .number()
        .required(t('validation.required'))
        .integer(t('validation.country_id.integer'))
        .min(1, t('validation.country_id.min')),
    status: yup.boolean().required(t('validation.required'))
});
