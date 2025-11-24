import * as yup from 'yup';
import { t } from 'i18next';

export const sessionModesSchema = yup.object({
    name: yup.object({
        en: yup.string().required(t('validation.required')),
        ar: yup.string().required(t('validation.required'))
    }),
    status: yup.boolean().required(t('validation.required'))
});