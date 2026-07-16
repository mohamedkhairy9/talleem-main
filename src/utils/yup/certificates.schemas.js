import * as yup from 'yup';
import { t } from 'i18next';

export const certificatesSchema = yup.object({
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

    file: yup
        .mixed()
        .required(t('validation.required'))
});
