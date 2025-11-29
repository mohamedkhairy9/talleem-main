import * as yup from 'yup';
import { t } from 'i18next';

export const certificatesSchema = yup.object({
    issued_from: yup
        .string()
        .required(t('validation.required'))
        .oneOf(['high management', 'branch management', 'entity management'], t('validation.invalid_issued_from')),
    
    // Filter fields - not required in submission but needed for form
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
    
    // Actual submission fields
    student_id: yup
        .number()
        .required(t('validation.required'))
        .positive(t('validation.required')),
    
    certificate_name_id: yup
        .number()
        .required(t('validation.required'))
        .positive(t('validation.required')),
    
    issued_date: yup
        .string()
        .required(t('validation.required'))
        .test('is-valid-date', t('validation.invalid_date'), value => {
            if (!value) return false;
            const date = new Date(value);
            return date <= new Date();
        }),
    
    is_active: yup
        .mixed()
        .required(t('validation.required'))
        .transform((value) => {
            // Transform boolean to number
            if (typeof value === 'boolean') {
                return value ? 1 : 0;
            }
            // If already a number, return it
            if (typeof value === 'number') {
                return value;
            }
            // If string, convert to number
            return Number(value);
        })
        .test('is-valid-status', t('validation.required'), value => {
            return value === 0 || value === 1;
        }),
    
    file: yup
        .mixed()
        .required(t('validation.required'))
});