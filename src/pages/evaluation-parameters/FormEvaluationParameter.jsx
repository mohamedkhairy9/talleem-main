import React, { useEffect, useMemo, useState } from 'react';
import useRFH from '@/utils/hooks/global/useRFH';
import { evaluationParametersSchema as schema } from '@/utils/yup/evaluationParameters.schemas';
import InputRFH from '@/components/common/inputs/InputRFH';
import Btn from '@/components/common/buttons/Btn';
import { getNestedError } from '@/utils/helpers/getNestedError';
import { generateOptions } from '@/utils/helpers/global.fns';
import useLocale from '@/utils/hooks/global/useLocale';
import i18next from 'i18next';
import { roleOptions, evaluationSystemOptions, simpleFields, criteriaFields, dashboardOptions, evaluationForOptions, modelTypeOptions } from './configs';
import { enabledDisabledOptions, yesNoOptions } from '@/utils/constants/options';
import { isFieldRequired } from '@/utils/helpers/schemaHelpers';
import ModalContent from '@/components/common/form/ModalContent';
import ModalFooter from '@/components/common/form/ModalFooter';

export default function FormEvaluationParameter({
    onClose,
    oldData,
    viewMode,
    isPending,
    mutate,
    mainProgramsData
}) {
    const { t } = useLocale();
    const currentLang = i18next.language;

    // Prepare old data BEFORE initializing the form
    const initialFormData = useMemo(() => {
        if (!oldData) return {
            is_active: true,
            include_attachments: false,
            pass_grade: '',
            criteria: [{ criteria_name: { en: '', ar: '' }, degree: '' }]
        };

        const evaluationSystem = oldData.evaluation_system?.en || oldData.evaluation_system || '';

        return {
            ...oldData,
            model_type: oldData.model_type?.en || oldData.model_type || '',
            evaluation_for: oldData.evaluation_for?.en || oldData.evaluation_for || '',
            evaluation_system: evaluationSystem,
            // Set total_grade to 100 if evaluation_system is percentage
            total_grade: evaluationSystem === 'percentage' ? 100 : oldData.total_grade,
            dashboards: Array.isArray(oldData.dashboards)
                ? oldData.dashboards.map(item => typeof item === 'object' ? item.en : item)
                : [],
            receivers: Array.isArray(oldData.receivers)
                ? oldData.receivers.map(item => typeof item === 'object' ? item.en : item)
                : []
        };
    }, [oldData]);

    const { register, errors, handleSubmit, control, setValue, watch } = useRFH({
        schema,
        defaultValues: initialFormData
    });

    // Track if form has been submitted to show errors
    const [hasSubmitted, setHasSubmitted] = useState(false);

    // Watch evaluation_for to filter out from dashboards options
    const evaluationFor = watch('evaluation_for');

    // Watch evaluation_system to conditionally show/hide total_grade
    const evaluationSystem = watch('evaluation_system');

    // Watch total_grade for criteria validation display
    const totalGrade = watch('total_grade');

    // Watch criteria to handle dynamic fields
    const criteria = watch('criteria') || initialFormData.criteria || [{ criteria_name: { en: '', ar: '' }, degree: '' }];

    // Calculate sum of criteria degrees
    const criteriaSum = useMemo(() => {
        if (!criteria || criteria.length === 0) return 0;
        return criteria.reduce((sum, criterion) => {
            const degree = Number(criterion.degree) || 0;
            return sum + degree;
        }, 0);
    }, [criteria]);

    // Get expected total (100 for percentage, otherwise total_grade)
    const expectedTotal = evaluationSystem === 'percentage' ? 100 : (Number(totalGrade) || 0);

    // Check if sum matches expected total
    const isSumValid = criteriaSum === expectedTotal;

    // Transform dashboard options for select display
    const dashboardSelectOptions = useMemo(() =>
        dashboardOptions.map(option => ({
            value: option.value,
            label: option.label[currentLang],
            id: option.value,
            name: option.label[currentLang] // Add name for compatibility
        }))
        , [currentLang]);

    // Transform evaluation for options for select display
    const evaluationForSelectOptions = useMemo(() =>
        evaluationForOptions.map(option => ({
            value: option.value,
            label: option.label[currentLang],
            id: option.value,
            name: option.label[currentLang] // Add name for compatibility
        }))
        , [currentLang]);

    // Transform evaluation system options for select display
    const evaluationSystemSelectOptions = useMemo(() =>
        evaluationSystemOptions.map(system => ({
            value: system.value,
            label: system.label[currentLang],
            id: system.value,
            name: system.label[currentLang]
        }))
        , [currentLang]);

    // Transform model type options for select display
    const modelTypeSelectOptions = useMemo(() =>
        modelTypeOptions.map(option => ({
            value: option.value,
            label: option.label[currentLang],
            id: option.value,
            name: option.label[currentLang]
        }))
        , [currentLang]);

    // Transform enabled/disabled options to fix the crash
    const statusOptions = useMemo(() => {
        return enabledDisabledOptions.map(option => ({
            value: option.value,
            label: option.label[currentLang], // Extract current language
            id: option.value,
            name: option.label[currentLang] // Add name for compatibility
        }));
    }, [currentLang]);

    // Transform yes/no options for include_attachments
    const yesNoSelectOptions = useMemo(() => {
        return yesNoOptions.map(option => ({
            value: option.value,
            label: option.label[currentLang],
            id: option.value,
            name: option.label[currentLang]
        }));
    }, [currentLang]);

    // Filter dashboards options - exclude evaluation_for value
    const dashboardsFilteredOptions = useMemo(() => {
        return dashboardSelectOptions.filter(option => option.value !== evaluationFor);
    }, [dashboardSelectOptions, evaluationFor]);

    // Filter receivers options - exclude evaluation_for value (use dashboard options for receivers)
    const receiversFilteredOptions = useMemo(() => {
        return dashboardSelectOptions.filter(option => option.value !== evaluationFor);
    }, [dashboardSelectOptions, evaluationFor]);

    // Effect to clear evaluation_for from dashboards if it's selected
    // Only run when evaluationFor changes, not when selectedDashboards changes
    useEffect(() => {
        if (!evaluationFor) {
            return;
        }
        
        // Read current values inside the effect to avoid stale closures
        const currentDashboards = watch('dashboards') || [];
        
        if (!Array.isArray(currentDashboards) || currentDashboards.length === 0) {
            return;
        }
        
        // Use a more robust comparison that handles type differences
        const hasEvaluationFor = currentDashboards.some(d => {
            return String(d) === String(evaluationFor) || Number(d) === Number(evaluationFor);
        });
        
        if (hasEvaluationFor) {
            const newDashboards = currentDashboards.filter(d => {
                return String(d) !== String(evaluationFor) && Number(d) !== Number(evaluationFor);
            });
            setValue('dashboards', newDashboards, { shouldValidate: false });
        }
    }, [evaluationFor, watch, setValue]); // Only depend on evaluationFor

    // Effect to clear evaluation_for from receivers if it's selected
    // Only run when evaluationFor changes, not when selectedReceivers changes
    useEffect(() => {
        if (!evaluationFor) {
            return;
        }
        
        // Read current values inside the effect to avoid stale closures
        const currentReceivers = watch('receivers') || [];
        
        if (!Array.isArray(currentReceivers) || currentReceivers.length === 0) {
            return;
        }
        
        // Use a more robust comparison that handles type differences
        const hasEvaluationFor = currentReceivers.some(r => {
            return String(r) === String(evaluationFor) || Number(r) === Number(evaluationFor);
        });
        
        if (hasEvaluationFor) {
            const newReceivers = currentReceivers.filter(r => {
                return String(r) !== String(evaluationFor) && Number(r) !== Number(evaluationFor);
            });
            setValue('receivers', newReceivers, { shouldValidate: false });
        }
    }, [evaluationFor, watch, setValue]); // Only depend on evaluationFor

    // Effect to set total_grade to 100 when evaluation_system is percentage
    useEffect(() => {
        if (evaluationSystem === 'percentage') {
            setValue('total_grade', 100, { shouldValidate: false });
        }
    }, [evaluationSystem, setValue]);

    // Add new criteria row
    const addCriteria = () => {
        const newCriteria = [...criteria, { criteria_name: { en: '', ar: '' }, degree: '' }];
        setValue('criteria', newCriteria);
    };

    // Remove criteria row
    const removeCriteria = (index) => {
        const newCriteria = criteria.filter((_, i) => i !== index);
        setValue('criteria', newCriteria);
    };

    // Helper function to collect only criteria degree errors
    const collectCriteriaDegreeErrors = (errorObj) => {
        const errorList = [];
        
        if (!errorObj || !errorObj.criteria || typeof errorObj.criteria !== 'object') return errorList;
        
        // Check if criteria has a general error (like sum validation)
        if (errorObj.criteria?.message) {
            errorList.push({
                path: 'criteria',
                label: t('evaluation_parameters.criteria'),
                message: errorObj.criteria.message
            });
        }
        
        // Check each criterion for degree errors
        if (Array.isArray(errorObj.criteria)) {
            errorObj.criteria.forEach((criterionError, index) => {
                if (criterionError?.degree?.message) {
                    errorList.push({
                        path: `criteria.${index}.degree`,
                        label: `${t('evaluation_parameters.criterion')} ${index + 1} - ${t('validation.degree.label')}`,
                        message: criterionError.degree.message
                    });
                }
            });
        } else if (typeof errorObj.criteria === 'object') {
            // Handle object structure (non-array)
            Object.keys(errorObj.criteria).forEach(key => {
                if (!isNaN(key)) {
                    // It's an array index
                    const index = parseInt(key);
                    const criterionError = errorObj.criteria[key];
                    if (criterionError?.degree?.message) {
                        errorList.push({
                            path: `criteria.${index}.degree`,
                            label: `${t('evaluation_parameters.criterion')} ${index + 1} - ${t('validation.degree.label')}`,
                            message: criterionError.degree.message
                        });
                    }
                }
            });
        }
        
        return errorList;
    };

    // Collect only criteria degree errors for display
    const allErrors = useMemo(() => {
        if (!errors || Object.keys(errors).length === 0) return [];
        return collectCriteriaDegreeErrors(errors);
    }, [errors, t]);

    function onSubmit(data) {
        setHasSubmitted(true);
        console.log('Form data before transformation:', data);

        // Helper function to transform value to bilingual object
        const toBilingualObject = (value, optionsArray) => {
            const option = optionsArray.find(r => r.value === value);
            return {
                en: value,
                ar: option?.label.ar || value
            };
        };

        // Transform data to match API expectations
        const transformedData = {
            ...data,
            model_type: data.model_type,
            evaluation_for: toBilingualObject(data.evaluation_for, evaluationForOptions),
            evaluation_system: {
                en: data.evaluation_system,
                ar: evaluationSystemOptions.find(s => s.value === data.evaluation_system)?.label.ar || data.evaluation_system
            },
            // Set total_grade to 100 if evaluation_system is percentage
            total_grade: data.evaluation_system === 'percentage' ? 100 : data.total_grade,
            dashboards: Array.isArray(data.dashboards)
                ? data.dashboards.map(value => toBilingualObject(value, dashboardOptions))
                : [],
            receivers: Array.isArray(data.receivers)
                ? data.receivers.map(value => toBilingualObject(value, dashboardOptions))
                : []
        };

        console.log('Transformed data for API:', transformedData);

        mutate(transformedData, {
            onSuccess: () => {
                onClose();
            }
        });
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
            <ModalContent className="space-y-4">
                {/* Basic Fields */}
                <div className="space-y-3">
                <h3 className="text-lg font-semibold border-b pb-2">{t('evaluation_parameters.basic_info')}</h3>

                {/* 1. Program */}
                <InputRFH
                    p="px-3 py-3"
                    control={control}
                    register={register}
                    error={getNestedError(errors, 'main_program_id')}
                    type="select"
                    placeholder={t('validation.program.placeholder')}
                    label={t('validation.program.label')}
                    name="main_program_id"
                    disabled={viewMode}
                    options={generateOptions(mainProgramsData)}
                    required={isFieldRequired(schema, 'main_program_id')}
                />

                {/* 2. Model Name Fields - Dynamic from config (name.en, name.ar) */}
                {simpleFields.map(field => (
                    <InputRFH
                        key={field.name}
                        p="px-3 py-3"
                        control={control}
                        register={register}
                        error={getNestedError(errors, field.name)}
                        type={field.type}
                        placeholder={t(field.placeholder)}
                        label={t(field.label)}
                        name={field.name}
                        disabled={viewMode}
                        required={isFieldRequired(schema, field.name)}/>
                ))}

                {/* 2.5. Model Type - Single Select */}
                <InputRFH
                    p="px-3 py-3"
                    control={control}
                    register={register}
                    error={getNestedError(errors, 'model_type')}
                    type="select"
                    placeholder={t('validation.model_type.placeholder')}
                    label={t('validation.model_type.label')}
                    name="model_type"
                    disabled={viewMode}
                    options={modelTypeSelectOptions}
                    required={isFieldRequired(schema, "model_type")}/>

                {/* 3. Dashboards (Multi-Select) - Filtered to exclude evaluation_for */}
                <InputRFH
                    p="px-3 py-3"
                    control={control}
                    register={register}
                    error={getNestedError(errors, 'dashboards')}
                    type="select"
                    isMulti={true}
                    placeholder={t('validation.dashboards.placeholder')}
                    label={t('validation.dashboards.label')}
                    name="dashboards"
                    disabled={viewMode}
                    options={dashboardsFilteredOptions}
                    required={isFieldRequired(schema, "dashboards")}/>

                {/* 4. Evaluation For (Single Select) */}
                <InputRFH
                    p="px-3 py-3"
                    control={control}
                    register={register}
                    error={getNestedError(errors, 'evaluation_for')}
                    type="select"
                    placeholder={t('validation.evaluation_for.placeholder')}
                    label={t('validation.evaluation_for.label')}
                    name="evaluation_for"
                    disabled={viewMode}
                    options={evaluationForSelectOptions}
                    required={isFieldRequired(schema, "evaluation_for")}/>

                {/* 5. Evaluation System */}
                <InputRFH
                    p="px-3 py-3"
                    control={control}
                    register={register}
                    error={getNestedError(errors, 'evaluation_system')}
                    type="select"
                    placeholder={t('validation.evaluation_system.placeholder')}
                    label={t('validation.evaluation_system.label')}
                    name="evaluation_system"
                    disabled={viewMode}
                    options={evaluationSystemSelectOptions}
                    required={isFieldRequired(schema, "evaluation_system")}/>

                {/* 6. Total Grade - Hidden when evaluation_system is percentage */}
                {evaluationSystem !== 'percentage' && (
                    <InputRFH
                        p="px-3 py-3"
                        control={control}
                        register={register}
                        error={getNestedError(errors, 'total_grade')}
                        type="number"
                        placeholder={t('validation.total_grade.placeholder')}
                        label={t('validation.total_grade.label')}
                        name="total_grade"
                        disabled={viewMode}
                        required={isFieldRequired(schema, "total_grade")}/>
                )}
                                <InputRFH
                    p="px-3 py-3"
                    control={control}
                    register={register}
                    error={getNestedError(errors, 'pass_grade')}
                    type="number"
                    placeholder={t('validation.pass_grade.placeholder')}
                    label={t('validation.pass_grade.label')}
                    name="pass_grade"
                    disabled={viewMode}
                    required={isFieldRequired(schema, "pass_grade")}/>

                {/* Receivers (Multi-Select) - Filtered to exclude evaluation_for */}
                <InputRFH
                    p="px-3 py-3"
                    control={control}
                    register={register}
                    error={getNestedError(errors, 'receivers')}
                    type="select"
                    isMulti={true}
                    placeholder={t('validation.receivers.placeholder')}
                    label={t('validation.receivers.label')}
                    name="receivers"
                    disabled={viewMode}
                    options={receiversFilteredOptions}
                    required={isFieldRequired(schema, "receivers")}/>

                {/* Include Attachments - Yes/No Select */}
                <InputRFH
                    p="px-3 py-3"
                    control={control}
                    register={register}
                    error={getNestedError(errors, 'include_attachments')}
                    type="select"
                    placeholder={t('validation.include_attachments.placeholder')}
                    label={t('validation.include_attachments.label')}
                    name="include_attachments"
                    disabled={viewMode}
                    options={yesNoSelectOptions}
                />

                {/* 10. Active - Using transformed statusOptions */}
                <InputRFH
                    p="px-3 py-3"
                    control={control}
                    register={register}
                    error={getNestedError(errors, 'is_active')}
                    type="select"
                    placeholder={t('validation.status.placeholder')}
                    label={t('validation.is_active.label')}
                    name="is_active"
                    disabled={viewMode}
                    options={statusOptions}
                />

            </div>

            {/* 7. Dynamic Criteria Section */}
            <div className="space-y-3">
                <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="text-lg font-semibold">{t('evaluation_parameters.criteria')}</h3>
                    {!viewMode && (
                        <button
                            type="button"
                            onClick={addCriteria}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
                        >
                            + {t('evaluation_parameters.add_criteria')}
                        </button>
                    )}
                </div>

                <div className="space-y-3">
                    {criteria.map((criterion, index) => (
                        <div key={index} className="border rounded-lg p-4 space-y-2 bg-gray-50">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-medium text-gray-700">
                                    {t('evaluation_parameters.criterion')} {index + 1}
                                </span>
                                {!viewMode && criteria.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeCriteria(index)}
                                        className="text-red-500 hover:text-red-700 font-semibold text-sm"
                                    >
                                        × {t('common.remove')}
                                    </button>
                                )}
                            </div>

                            {/* Criteria Fields - Dynamic from config */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {criteriaFields.map(field => (
                                    <InputRFH
                                        key={`${index}-${field.name}`}
                                        p="px-3 py-2"
                                        control={control}
                                        register={register}
                                        error={getNestedError(errors, `criteria.${index}.${field.name}`)}
                                        type={field.type}
                                        placeholder={t(field.placeholder)}
                                        label={t(field.label)}
                                        name={`criteria.${index}.${field.name}`}
                                        disabled={viewMode}
                                        required={isFieldRequired(schema, `criteria.${index}.${field.name}`)}/>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Degrees Calculation Validation - Only show when there's a validation error */}
                {getNestedError(errors, 'criteria') && (
                    <div className="mt-4 p-4 rounded-lg border-2 bg-red-50 border-red-300">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-red-800">
                                    {t('evaluation_parameters.degrees_calculation')}:
                                </span>
                                <span className="text-sm font-semibold text-gray-700">
                                    {criteriaSum} / {expectedTotal}
                                </span>
                            </div>
                            <span className="text-sm font-medium text-red-800">
                                ✗ {t('evaluation_parameters.degrees_mismatch')}
                            </span>
                        </div>
                        <p className="mt-2 text-sm text-red-700">
                            {getNestedError(errors, 'criteria')?.message || t('validation.criteria.sum_equals_total_grade')}
                        </p>
                    </div>
                )}
            </div>

            {/* Validation Errors Summary - Show when there are errors after submission */}
            {!viewMode && hasSubmitted && allErrors.length > 0 && (
                <div className="mt-4 p-4 bg-red-50 border-2 border-red-300 rounded-lg">
                    <h4 className="text-red-700 font-semibold mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {t('validation.please_fix_errors')}
                    </h4>
                    <ul className="list-disc list-inside space-y-2 text-sm text-red-700">
                        {allErrors.map((error, index) => (
                            <li key={`${error.path}-${index}`}>
                                <span className="font-medium">{error.label}:</span>{' '}
                                <span>{t(error.message) || error.message}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            </ModalContent>
            {!viewMode && (
                <ModalFooter>
                    <Btn
                        loading={isPending}
                        className="py-3 w-full"
                        type="submit"
                        label="common.submit"
                    />
                </ModalFooter>
            )}
        </form>
    );
}