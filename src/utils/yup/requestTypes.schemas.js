import * as yup from 'yup';

export const requestTypesSchema = yup.object().shape({
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
    })
});

