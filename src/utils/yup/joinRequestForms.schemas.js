import * as yup from 'yup';

// Schema for a single form field
const fieldSchema = yup.object().shape({
    key: yup
        .string()
        .required('validation.field_key.required')
        .matches(/^[a-zA-Z0-9_]+$/, 'validation.field_key.invalid')
        .test('no-spaces', 'validation.field_key.no_spaces', value => !value || !value.includes(' ')),
    label: yup.object().shape({
        en: yup.string().required('validation.label.required.en'),
        ar: yup.string().required('validation.label.required.ar')
    }),
    type: yup.string().required('validation.field_type.required'),
    required: yup.boolean(),
    validation_rules: yup.string().nullable()
});

export const createJoinRequestFormSchema = yup.object().shape({
    name: yup.object().shape({
        en: yup.string().required('validation.name.required.en'),
        ar: yup.string().required('validation.name.required.ar')
    }),
    description: yup.object().shape({
        en: yup.string().nullable(),
        ar: yup.string().nullable()
    }).nullable(),
    data: yup.object().shape({
        fields: yup.array().of(fieldSchema).min(1, 'validation.fields.min')
    }),
    status: yup.boolean().required('validation.status.required')
});

export const updateJoinRequestFormSchema = createJoinRequestFormSchema;

