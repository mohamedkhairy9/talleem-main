import * as yup from 'yup';

export const getSendNotificationSchema = (selectedMethods, t) => {
    const baseSchema = {
        user_type: yup.array().min(1, t('validation.required')).required(t('validation.required'))
    };

    // Add title and content validation for each selected method
    if (selectedMethods.sms) {
        baseSchema.sms_title_ar = yup.string().required(t('validation.required'));
        baseSchema.sms_title_en = yup.string().required(t('validation.required'));
        baseSchema.sms_content_ar = yup.string().required(t('validation.required'));
        baseSchema.sms_content_en = yup.string().required(t('validation.required'));
    }

    if (selectedMethods.email) {
        baseSchema.email_title_ar = yup.string().required(t('validation.required'));
        baseSchema.email_title_en = yup.string().required(t('validation.required'));
        baseSchema.email_content_ar = yup.string().required(t('validation.required'));
        baseSchema.email_content_en = yup.string().required(t('validation.required'));
    }

    if (selectedMethods.push) {
        baseSchema.push_title_ar = yup.string().required(t('validation.required'));
        baseSchema.push_title_en = yup.string().required(t('validation.required'));
        baseSchema.push_content_ar = yup.string().required(t('validation.required'));
        baseSchema.push_content_en = yup.string().required(t('validation.required'));
    }

    if (selectedMethods.whatsapp) {
        baseSchema.whatsapp_title_ar = yup.string().required(t('validation.required'));
        baseSchema.whatsapp_title_en = yup.string().required(t('validation.required'));
        baseSchema.whatsapp_content_ar = yup.string().required(t('validation.required'));
        baseSchema.whatsapp_content_en = yup.string().required(t('validation.required'));
    }

    return yup.object().shape(baseSchema);
};