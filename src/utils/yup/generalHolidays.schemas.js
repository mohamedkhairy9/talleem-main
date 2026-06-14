import * as yup from 'yup';
import { t } from 'i18next';

export const generalHolidaysSchema = yup.object({
    name: yup
        .object({
            en: yup.string().required(t('validation.required')).min(1),
            ar: yup.string().required(t('validation.required')).min(1)
        })
        .required(t('validation.required')),
    date: yup.string().required(t('validation.date.required')),
    status: yup.boolean().required(t('validation.required'))
});
