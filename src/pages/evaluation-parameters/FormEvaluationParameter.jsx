import React, { useEffect, useMemo } from 'react';
import useRFH from '@/utils/hooks/global/useRFH';
import { evaluationParametersSchema as schema } from '@/utils/yup/evaluationParameters.schemas';
import InputRFH from '@/components/common/inputs/InputRFH';
import Btn from '@/components/common/buttons/Btn';
import { getNestedError } from '@/utils/helpers/getNestedError';
import { generateOptions } from '@/utils/helpers/global.fns';
import useLocale from '@/utils/hooks/global/useLocale';
import i18next from 'i18next';
import { roleOptions, evaluationSystemOptions, simpleFields, criteriaFields } from './configs';
import { enabledDisabledOptions } from '@/utils/constants/options';

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
            pass_grade: '',
            criteria: [{ criteria_name: { en: '', ar: '' }, degree: '' }]
        };

        return {
            ...oldData,
            evaluation_for: oldData.evaluation_for?.en || oldData.evaluation_for || '',
            evaluation_system: oldData.evaluation_system?.en || oldData.evaluation_system || '',
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

    // Watch evaluation_for to filter out from dashboards options
    const evaluationFor = watch('evaluation_for');
    const selectedDashboards = watch('dashboards') || [];
    const selectedReceivers = watch('receivers') || [];

    // Watch criteria to handle dynamic fields
    const criteria = watch('criteria') || initialFormData.criteria || [{ criteria_name: { en: '', ar: '' }, degree: '' }];

    // Transform role options for select display
    const roleSelectOptions = useMemo(() =>
        roleOptions.map(role => ({
            value: role.value,
            label: role.label[currentLang],
            id: role.value,
            name: role.label[currentLang] // Add name for compatibility
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

    // Transform enabled/disabled options to fix the crash
    const statusOptions = useMemo(() => {
        return enabledDisabledOptions.map(option => ({
            value: option.value,
            label: option.label[currentLang], // Extract current language
            id: option.value,
            name: option.label[currentLang] // Add name for compatibility
        }));
    }, [currentLang]);

    // Filter dashboards options - exclude evaluation_for value
    const dashboardsFilteredOptions = useMemo(() => {
        return roleSelectOptions.filter(option => option.value !== evaluationFor);
    }, [roleSelectOptions, evaluationFor]);

    // Filter receivers options - exclude evaluation_for value
    const receiversFilteredOptions = useMemo(() => {
        return roleSelectOptions.filter(option => option.value !== evaluationFor);
    }, [roleSelectOptions, evaluationFor]);

    // Effect to clear evaluation_for from dashboards if it's selected
    useEffect(() => {
        if (evaluationFor && selectedDashboards.includes(evaluationFor)) {
            const newDashboards = selectedDashboards.filter(d => d !== evaluationFor);
            setValue('dashboards', newDashboards);
        }
    }, [evaluationFor, selectedDashboards, setValue]);

    // Effect to clear evaluation_for from receivers if it's selected
    useEffect(() => {
        if (evaluationFor && selectedReceivers.includes(evaluationFor)) {
            const newReceivers = selectedReceivers.filter(r => r !== evaluationFor);
            setValue('receivers', newReceivers);
        }
    }, [evaluationFor, selectedReceivers, setValue]);

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

    function onSubmit(data) {
        console.log('Form data before transformation:', data);

        // Helper function to transform value to bilingual object
        const toBilingualObject = (value) => {
            const roleOption = roleOptions.find(r => r.value === value);
            return {
                en: value,
                ar: roleOption?.label.ar || value
            };
        };

        // Transform data to match API expectations
        const transformedData = {
            ...data,
            evaluation_for: toBilingualObject(data.evaluation_for),
            evaluation_system: {
                en: data.evaluation_system,
                ar: evaluationSystemOptions.find(s => s.value === data.evaluation_system)?.label.ar || data.evaluation_system
            },
            dashboards: Array.isArray(data.dashboards)
                ? data.dashboards.map(value => toBilingualObject(value))
                : [],
            receivers: Array.isArray(data.receivers)
                ? data.receivers.map(value => toBilingualObject(value))
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
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4 max-h-[80vh] overflow-y-auto">
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
                    />
                ))}

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
                />

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
                    options={roleSelectOptions}
                />

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
                />

                {/* 6. Total Grade */}
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
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 8. Pass Grade & 9. Assessment Recipients */}
            <div className="space-y-3">
                {/* Pass Grade */}
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
                />

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

            {/* Submit Button */}
            {!viewMode && (
                <div className="pt-4 border-t">
                    <Btn
                        loading={isPending}
                        className="py-3 w-full"
                        type="submit"
                        label="common.submit"
                    />
                </div>
            )}
        </form>
    );
}