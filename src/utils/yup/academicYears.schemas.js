import * as yup from 'yup';
import { t } from 'i18next';

export const academicYearsSchema = yup.object({
    name: yup
        .object({
            en: yup.string().required(t('validation.required')).min(1),
            ar: yup.string().required(t('validation.required')).min(1)
        })
        .required(t('validation.required')),
    start_date: yup
        .date()
        .required(t('validation.start_date.required'))
        .typeError(t('validation.start_date.invalid')),
    end_date: yup
        .date()
        .required(t('validation.end_date.required'))
        .min(yup.ref('start_date'), t('validation.end_date.after_start'))
        .typeError(t('validation.end_date.invalid')),
    status: yup.boolean().required(t('validation.required'))
});
