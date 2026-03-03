import * as yup from 'yup';
import { t } from 'i18next';

export const examSegmentsCountSchema = yup.object({
    name: yup
        .object({
            en: yup
                .string()
                .required(t('validation.required'))
                .min(2, t('validation.name.en_min')),
            ar: yup
                .string()
                .required(t('validation.required'))
                .min(2, t('validation.name.ar_min'))
        })
        .required(t('validation.required')),
    parts_count: yup
        .number()
        .required(t('validation.required'))
        .min(1, t('validation.min_value', { min: 1 }))
        .max(30, t('validation.max_value', { max: 30 }))
        .integer(t('validation.must_be_integer')),
    
    segments_required: yup
        .number()
        .required(t('validation.required'))
        .min(1, t('validation.min_value', { min: 1 }))
        .integer(t('validation.must_be_integer')),
    
    is_active: yup
        .boolean()
        .required(t('validation.required'))
});