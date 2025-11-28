import * as yup from 'yup';

export const warningReasonsSchema = yup.object().shape({
    name: yup.object().shape({
        en: yup
            .string()
            .required('validation.description.required.en')
            .min(1, 'validation.description.min.en')
            .matches(/[a-zA-Z0-9]/, 'validation.description.alphanumeric.en'),
        ar: yup
            .string()
            .required('validation.description.required.ar')
            .min(1, 'validation.description.min.ar')
            .matches(/[a-zA-Z0-9\u0600-\u06FF]/, 'validation.description.alphanumeric.ar')
    }),
    main_program_id: yup
        .number()
        .required('validation.program.required')
        .positive('validation.program.invalid'),
    status: yup.boolean().required('validation.status.required')
});