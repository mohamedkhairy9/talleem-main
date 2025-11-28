import * as yup from 'yup';
import { t } from 'i18next';

export const inspectorAssignmentsSchema = yup.object({
    assignment_type: yup
        .string()
        .required(t('validation.required'))
        .test('is-valid-type', t('validation.invalid_value'), function(value) {
            // قبول القيم كـ string أو كرقم
            const validValues = ['regular', 'committee'];
            return validValues.includes(value);
        }),
    
    main_program_id: yup
        .mixed()
        .test('is-valid-program', t('validation.required'), function(value) {
            if (!value) return false;
            // قبول number أو string
            return typeof value === 'number' ? value > 0 : !isNaN(parseInt(value));
        })
        .required(t('validation.required')),
    
    branch_id: yup
        .mixed()
        .test('is-valid-branch', t('validation.required'), function(value) {
            if (!value) return false;
            // قبول number أو string
            return typeof value === 'number' ? value > 0 : !isNaN(parseInt(value));
        })
        .required(t('validation.required')),
    
    entity_ids: yup
        .mixed()
        .test('is-valid-array', t('validation.at_least_one'), function(value) {
            // إذا كان array
            if (Array.isArray(value)) {
                return value.length > 0 && value.every(v => 
                    typeof v === 'number' ? v > 0 : !isNaN(parseInt(v))
                );
            }
            // إذا كان رقم واحد (من single select)
            if (typeof value === 'number' && value > 0) {
                return true;
            }
            // إذا كان string رقم
            if (typeof value === 'string' && !isNaN(parseInt(value))) {
                return true;
            }
            return false;
        })
        .required(t('validation.required')),
    
    supervisor_ids: yup
        .mixed()
        .test('is-valid-supervisors', t('validation.at_least_one'), function(value) {
            const { assignment_type } = this.parent;
            
            // إذا كان array
            if (Array.isArray(value)) {
                if (value.length === 0) return false;
                
                // التحقق من أن كل القيم صحيحة
                const allValid = value.every(v => 
                    typeof v === 'number' ? v > 0 : !isNaN(parseInt(v))
                );
                if (!allValid) return false;
                
                // إذا كان regular، يجب أن يكون مشرف واحد فقط
                if (assignment_type === 'regular' && value.length > 1) {
                    return this.createError({
                        message: t('validation.regular_one_supervisor')
                    });
                }
                
                return true;
            }
            
            // إذا كان رقم واحد (من single select)
            if (typeof value === 'number' && value > 0) {
                return true;
            }
            
            // إذا كان string رقم
            if (typeof value === 'string' && !isNaN(parseInt(value))) {
                return true;
            }
            
            return false;
        })
        .required(t('validation.required')),
    
    from_date: yup
        .string()
        .required(t('validation.required')),
    
    to_date: yup
        .string()
        .required(t('validation.required'))
        .test('is-after-start', t('validation.to_date_after_start'), function(value) {
            const { from_date } = this.parent;
            if (!value || !from_date) return true;
            return new Date(value) >= new Date(from_date);
        }),
    
    notes: yup.string().nullable(),
    
    status: yup.boolean().required(t('validation.required'))
});