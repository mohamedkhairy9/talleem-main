import * as yup from 'yup';
import { t } from 'i18next'

export const remotelyAttendancePlatformsSchema = yup.object({
    name: yup
        .object({
            ar: yup.string().required(t('validation.required')).min(1),
            en: yup.string().required(t('validation.required')).min(1)
        })
        .required(t('validation.required')),
    status: yup.boolean().required(t('validation.required')),
})
