import * as yup from 'yup';

export const getSendNotificationSchema = (selectedMethods, t) => {
    const baseSchema = {
        user_type: yup.array().min(1, t('validation.required')),
        title_ar: yup.string().required(t('validation.required')),
        title_en: yup.string().required(t('validation.required')),
        description_ar: yup.string().required(t('validation.required')),
        description_en: yup.string().required(t('validation.required'))
    };

    return yup.object().shape(baseSchema);
};