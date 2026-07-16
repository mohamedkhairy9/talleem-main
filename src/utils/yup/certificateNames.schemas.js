import * as yup from 'yup';
import { t } from 'i18next';

export const certificateNamesSchema = yup.object({
    name: yup.object({
        ar: yup
            .string()
            .required(t('validation.required'))
            .min(2, t('validation.min_length', { min: 2 })),
        en: yup
            .string()
            .required(t('validation.required'))
            .min(2, t('validation.min_length', { min: 2 }))
    }).required(t('validation.required')),
    
    main_program_id: yup
        .mixed()
        .test('is-valid-program', t('validation.required'), function(value) {
            if (!value) return false;
            return typeof value === 'number' ? value > 0 : !isNaN(parseInt(value));
        })
        .required(t('validation.required')),

    issued_from: yup
        .string()
        .required(t('validation.required'))
        .oneOf(['high management', 'branch management', 'entity management'], t('validation.invalid_issued_from')),
    
    status: yup.boolean().required(t('validation.required'))
});
