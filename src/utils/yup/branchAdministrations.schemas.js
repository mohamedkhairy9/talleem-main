import * as yup from 'yup';
import { t } from 'i18next';

export const branchAdministrationsSchema = yup.object({
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
    branch_id: yup
        .number()
        .required(t('validation.required'))
        .integer(t('validation.branch_id.integer'))
        .min(1, t('validation.branch_id.min')),
    status: yup.boolean().required(t('validation.required'))
});
