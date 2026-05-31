import * as yup from 'yup';
import { t } from 'i18next';

export const usersSchema = yup.object().shape({
    name: yup
        .object({
            en: yup
                .string()
                .required(t('validation.required'))
                .min(2, t('validation.name.en_min')),
            ar: yup.string().nullable().optional()
        })
        .required(t('validation.required')),
    email: yup
        .string()
        .required(t('validation.required')),
    password: yup.string().nullable().optional().min(6, t('validation.password.min')),
    branch_id: yup
        .number()
        .required(t('validation.required'))
        .integer(t('validation.branch_id.integer'))
        .min(1, t('validation.branch_id.min')),
    entity_id: yup
        .number()
        .required(t('validation.required'))
        .integer(t('validation.entity_id.integer'))
        .min(1, t('validation.entity_id.min')),
    role_id: yup.number().required(t('validation.required')).integer().min(1, t('validation.required')),
});
