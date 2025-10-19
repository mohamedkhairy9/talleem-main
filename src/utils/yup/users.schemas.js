import * as yup from 'yup';
import { t } from 'i18next';

export const usersSchema = yup.object().shape({
    name: yup
        .string()
        .required(t('validation.required'))
        .min(2, 'Name must be at least 2 characters'),
    email: yup
        .string()
        .required(t('validation.required'))
        .email(t('validation.email.invalid')),
    password: yup
        .string()
        .when('$isEditMode', (isEditMode, schema) => {
            // Password is required for create, optional for edit
            return isEditMode
                ? schema
                : schema.required(t('validation.required'));
        })
        .min(6, t('validation.password.min')),
    phone: yup.string().required(t('validation.required')),
    branch_id: yup
        .number()
        .required(t('validation.required'))
        .integer(t('validation.branch_id.integer'))
        .min(1, t('validation.branch_id.min')),
    locale: yup
        .string()
        .required(t('validation.required'))
        .oneOf(['en', 'ar'], t('validation.locale.invalid')),
    current_app_locale: yup
        .string()
        .required(t('validation.required'))
        .oneOf(['en', 'ar'], t('validation.current_app_locale.invalid')),
    status: yup.boolean().required(t('validation.required')),
    user_type: yup
        .string()
        .required(t('validation.required'))
        .oneOf(['employee'], t('validation.user_type.invalid'))
});
