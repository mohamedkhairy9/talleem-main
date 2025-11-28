import * as yup from 'yup';
import { t } from 'i18next';

export const entityActivitiesSchema = yup.object({
    activity_id: yup
        .number()
        .required(t('validation.required'))
        .positive(t('validation.required')),
    entity_id: yup
        .number()
        .required(t('validation.required'))
        .positive(t('validation.required')),
    status: yup.boolean().required(t('validation.required'))
});
