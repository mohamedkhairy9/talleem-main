import * as yup from 'yup';
import { t } from 'i18next';

export const onlineAttendancesSchema = yup.object().shape({
    user_id: yup
        .number()
        .required(t('validation.required'))
        .integer(t('validation.user_id.integer'))
        .min(1, t('validation.user_id.min')),
    check_in: yup.string().required(t('validation.required')),
    check_out: yup.string().required(t('validation.required')),
    status: yup.boolean().required(t('validation.required'))
});
