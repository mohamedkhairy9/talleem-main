import * as yup from 'yup';
import { t } from 'i18next';

export const warningsSchema = yup.object({
    warning_type: yup
        .string()
        .required(t('validation.required'))
        .oneOf(['student', 'teacher', 'entity'], t('validation.invalid_value')),
    
    program_id: yup
        .mixed()
        .test('is-valid-program', t('validation.required'), function(value) {
            if (!value) return false;
            return typeof value === 'number' ? value > 0 : !isNaN(parseInt(value));
        })
        .required(t('validation.required')),
    
    branch_id: yup
        .mixed()
        .test('is-valid-branch', t('validation.required'), function(value) {
            if (!value) return false;
            return typeof value === 'number' ? value > 0 : !isNaN(parseInt(value));
        })
        .required(t('validation.required')),
    
    entity_id: yup
        .mixed()
        .test('is-valid-entity', t('validation.required'), function(value) {
            if (!value) return false;
            return typeof value === 'number' ? value > 0 : !isNaN(parseInt(value));
        })
        .required(t('validation.required')),
    
    student_id: yup
        .mixed()
        .nullable()
        .test('required-for-student', t('validation.required'), function(value) {
            const { warning_type } = this.parent;
            // إلزامي فقط إذا كان warning_type = student
            if (warning_type === 'student') {
                if (!value) return false;
                return typeof value === 'number' ? value > 0 : !isNaN(parseInt(value));
            }
            return true;
        }),
    
    teacher_id: yup
        .mixed()
        .nullable()
        .test('required-for-teacher', t('validation.required'), function(value) {
            const { warning_type } = this.parent;
            // إلزامي فقط إذا كان warning_type = teacher
            if (warning_type === 'teacher') {
                if (!value) return false;
                return typeof value === 'number' ? value > 0 : !isNaN(parseInt(value));
            }
            return true;
        }),
    
    warning_reason_id: yup
        .mixed()
        .test('is-valid-reason', t('validation.required'), function(value) {
            if (!value) return false;
            return typeof value === 'number' ? value > 0 : !isNaN(parseInt(value));
        })
        .required(t('validation.required')),
    
    date: yup
        .string()
        .required(t('validation.required'))
        .test('is-today-or-past', t('validation.date_must_be_today_or_past'), function(value) {
            if (!value) return false;

            const selectedDate = new Date(value);
            const today = new Date();

            today.setHours(0, 0, 0, 0);
            selectedDate.setHours(0, 0, 0, 0);

            // Allow only today or past; no future dates
            return selectedDate <= today;
        }),
    
    note: yup.string().nullable(),
    
    status: yup.boolean().required(t('validation.required'))
});
