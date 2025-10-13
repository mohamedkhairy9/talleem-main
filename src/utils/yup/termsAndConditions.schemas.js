import * as yup from 'yup';
import { t } from 'i18next';

export const termsAndConditionsSchema = yup.object({
    description: yup
        .object({
            en: yup
                .string()
                .required(t('validation.required'))
                .min(10, t('validation.description.en_min'))
                .max(5000, t('validation.description.en_max')),
            ar: yup
                .string()
                .required(t('validation.required'))
                .min(10, t('validation.description.ar_min'))
                .max(5000, t('validation.description.ar_max'))
        })
        .required(t('validation.required')),
    status: yup.boolean().required(t('validation.required'))
});
