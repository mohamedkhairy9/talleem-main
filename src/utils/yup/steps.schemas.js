import * as yup from 'yup';

export const createStepSchema = yup.object().shape({
    phase_id: yup.number().required('validation.phase_id.required'),
    name: yup.object().shape({
        en: yup.string().required('validation.name.required.en'),
        ar: yup.string().required('validation.name.required.ar')
    }),
    order: yup.number().integer('validation.order.integer').min(1, 'validation.order.min').required('validation.order.required'),
    assigned_to_type: yup.string().required('validation.assigned_to_type.required'),
    assigned_to_id: yup.number().required('validation.assigned_to_id.required'),
    step_type: yup.string().required('validation.step_type.required'),
    join_request_form_id: yup.number().nullable(),
    status: yup.boolean().required('validation.status.required'),
    config: yup.object().nullable()
});

export const updateStepSchema = createStepSchema;

