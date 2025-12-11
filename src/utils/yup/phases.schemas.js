import * as yup from 'yup';

export const phasesSchema = yup.object().shape({
    name: yup.object().shape({
        en: yup
            .string()
            .required('validation.name.required.en')
            .min(1, 'validation.name.min.en')
            .matches(/[a-zA-Z0-9]/, 'validation.name.alphanumeric.en'),
        ar: yup
            .string()
            .required('validation.name.required.ar')
            .min(1, 'validation.name.min.ar')
            .matches(/[a-zA-Z0-9\u0600-\u06FF]/, 'validation.name.alphanumeric.ar')
    }),
    request_type_id: yup
        .number()
        .required('validation.request_type_id.required')
        .positive('validation.request_type_id.invalid'),
    order: yup
        .number()
        .required('validation.order.required')
        .positive('validation.order.invalid')
        .integer('validation.order.integer'),
    status: yup.boolean().required('validation.status.required')
});

