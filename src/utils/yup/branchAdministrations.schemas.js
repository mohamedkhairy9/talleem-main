import * as yup from 'yup';
import { t } from 'i18next';

export const branchAdministrationsSchema = yup.object({
    branch_id: yup
        .number()
        .required(t('validation.required'))
        .integer(t('validation.branch_id.integer'))
        .min(1, t('validation.branch_id.min')),
    user_id: yup
        .number()
        .required(t('validation.required'))
        .integer(t('validation.user_id.integer'))
        .min(1, t('validation.user_id.min')),

    description: yup
        .object({
            en: yup
                .string()
                .required(t('validation.required'))
                .min(10, t('validation.description.en_min'))
                .max(500, t('validation.description.en_max')),
            ar: yup
                .string()
                .required(t('validation.required'))
                .min(10, t('validation.description.ar_min'))
                .max(500, t('validation.description.ar_max'))
        })
        .required(t('validation.required'))
});
