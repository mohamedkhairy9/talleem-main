import * as yup from 'yup';
import { t } from 'i18next';

export const rolesSchema = yup.object({
    display_name: yup
        .object({
            en: yup.string().required(t('validation.required')).min(1),
            ar: yup.string().required(t('validation.required')).min(1)
        })
        .required(t('validation.required')),

    description: yup
        .object({
            en: yup.string().required(t('validation.required')).min(1),
            ar: yup.string().required(t('validation.required')).min(1)
        })
        .required(t('validation.required'))
});
