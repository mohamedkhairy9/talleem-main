import * as yup from 'yup';
import { t } from 'i18next';

export const onlineAttendancesSchema = yup.object().shape({
    attendance_type: yup
        .string()
        .required(t('validation.required'))
        .oneOf(
            ['check_in', 'check_out'],
            t('validation.attendance_type.invalid')
        ),
    user_id: yup
        .number()
        .required(t('validation.required'))
        .integer(t('validation.user_id.integer'))
        .min(1, t('validation.user_id.min')),
    attendance_datetime: yup.string().required(t('validation.required'))
});
