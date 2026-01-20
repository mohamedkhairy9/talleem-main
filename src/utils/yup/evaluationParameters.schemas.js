import * as yup from 'yup';

export const evaluationParametersSchema = yup.object().shape({
    name: yup.object().shape({
        en: yup
            .string()
            .required('validation.name.required.en')
            .min(1, 'validation.name.min.en'),
        ar: yup
            .string()
            .required('validation.name.required.ar')
            .min(1, 'validation.name.min.ar')
    }),
    main_program_id: yup
        .number()
        .required('validation.program.required')
        .positive('validation.program.invalid'),
    model_type: yup
        .string()
        .required('validation.model_type.required')
        .oneOf(['general evaluation', 'exams', 'interviews'], 'validation.model_type.invalid'),
    evaluation_for: yup
        .string()
        .required('validation.evaluation_for.required')
        .oneOf(['student', 'teacher', 'entity'], 'validation.evaluation_for.invalid'),
    evaluation_system: yup
        .string()
        .required('validation.evaluation_system.required')
        .oneOf(['percentage', 'numeric'], 'validation.evaluation_system.invalid'),
    total_grade: yup
        .number()
        .when('evaluation_system', {
            is: (value) => value !== 'percentage',
            then: (schema) => schema
                .required('validation.total_grade.required')
                .positive('validation.total_grade.positive')
                .integer('validation.total_grade.integer'),
            otherwise: (schema) => schema.nullable().optional()
        }),
    pass_grade: yup
        .number()
        .required('validation.pass_grade.required')
        .positive('validation.pass_grade.positive')
        .integer('validation.pass_grade.integer'),
    dashboards: yup
        .array()
        .of(yup.string().oneOf(['student', 'teacher', 'entity', 'branch-manager', 'admin-portal-branch', 'general-administration', 'admin-portal-main-administration']))
        .min(1, 'validation.dashboards.min')
        .required('validation.dashboards.required'),
    receivers: yup
        .array()
        .of(yup.string().oneOf(['student', 'teacher', 'entity', 'branch-manager', 'admin-portal-branch', 'general-administration', 'admin-portal-main-administration']))
        .min(1, 'validation.receivers.min')
        .required('validation.receivers.required'),
    criteria: yup
        .array()
        .of(
            yup.object().shape({
                criteria_name: yup.object().shape({
                    en: yup.string().required('validation.criteria_name.required.en'),
                    ar: yup.string().required('validation.criteria_name.required.ar')
                }),
                degree: yup
                    .number()
                    .nullable()
                    .optional()
            })
        )
        .min(1, 'validation.criteria.min')
        .required('validation.criteria.required'),
    is_active: yup.boolean().required('validation.is_active.required'),
    include_attachments: yup.boolean().nullable().optional()
});