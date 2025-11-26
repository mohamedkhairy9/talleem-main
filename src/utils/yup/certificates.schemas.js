import * as yup from 'yup';
import { t } from 'i18next';

export const certificatesSchema = yup.object({
    issued_by: yup
        .string()
        .required(t('validation.required'))
        .oneOf(['main_administration', 'branch', 'entity'], t('validation.invalid_issued_by')),
    
    main_program_id: yup
        .number()
        .required(t('validation.required'))
        .positive(t('validation.required')),
    
    branch_id: yup
        .number()
        .required(t('validation.required'))
        .positive(t('validation.required')),
    
    entity_id: yup
        .number()
        .required(t('validation.required'))
        .positive(t('validation.required')),
    
    student_id: yup
        .number()
        .required(t('validation.required'))
        .positive(t('validation.required')),
    
    certificate_name_id: yup
        .number()
        .required(t('validation.required'))
        .positive(t('validation.required')),
    
    obtained_date: yup
        .string()
        .required(t('validation.required'))
        .test('is-valid-date', t('validation.invalid_date'), value => {
            if (!value) return false;
            const date = new Date(value);
            return date <= new Date();
        }),
    
    certificate_image: yup
        .mixed()
        .required(t('validation.required'))
});