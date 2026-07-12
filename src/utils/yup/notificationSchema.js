import * as yup from 'yup';

export const getSendNotificationSchema = t => {
    const baseSchema = {
        user_id: yup
            .number()
            .transform((value, originalValue) =>
                originalValue === '' || originalValue == null
                    ? null
                    : Number(originalValue)
            )
            .nullable()
            .required(t('validation.required'))
            .typeError(t('validation.required')),
        sending_type: yup.string().required(t('validation.required')),
        title_ar: yup.string().required(t('validation.required')),
        title_en: yup.string().required(t('validation.required')),
        description_ar: yup.string().required(t('validation.required')),
        description_en: yup.string().required(t('validation.required'))
    };

    return yup.object().shape(baseSchema);
};
