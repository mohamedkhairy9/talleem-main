import * as yup from 'yup';
import { t } from 'i18next';

export const selectSchema = yup
    .string()
    .required(t('validation.required'))
    .min(1, t('validation.select.min'));

