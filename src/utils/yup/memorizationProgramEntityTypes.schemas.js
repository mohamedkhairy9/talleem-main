import * as yup from 'yup';
import { t } from 'i18next';

export const memorizationProgramEntityTypesSchema = yup.object({
    name: yup
        .object({
            en: yup.string().required(t('validation.required')).min(1),
            ar: yup.string().required(t('validation.required')).min(1)
        })
        .required(t('validation.required')),
    code: yup
        .number()
        .required(t('validation.required'))
        .integer(t('validation.code.integer'))
        .min(1, t('validation.code.min')),
    status: yup.boolean().required(t('validation.required'))
});
