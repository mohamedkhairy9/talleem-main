import * as yup from 'yup';
import { t } from 'i18next';

export const generalBannersSchema = yup.object({
    link: yup
        .string()
        .url(t('validation.link.url'))
        .required(t('validation.required')),
    start_date: yup
        .string()
        .required(t('validation.start_date.required')),
    end_date: yup
        .string()
        .required(t('validation.end_date.required')),
    status: yup.boolean().required(t('validation.required')),
    image: yup.mixed().required(t('validation.required'))
});
