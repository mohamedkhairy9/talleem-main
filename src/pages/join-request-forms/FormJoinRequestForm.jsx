import useRFH from '@/utils/hooks/global/useRFH';
import { createJoinRequestFormSchema as schema } from '@/utils/yup/joinRequestForms.schemas';
import React, { useMemo, useEffect, useCallback, useRef } from 'react';
import { Controller } from 'react-hook-form';
import { joinRequestFormsFields } from './configs';
import InputRFH from '@/components/common/inputs/InputRFH';
import Btn from '@/components/common/buttons/Btn';
import { getNestedError } from '@/utils/helpers/getNestedError';
import { isFieldRequired } from '@/utils/helpers/schemaHelpers';
import ModalContent from '@/components/common/form/ModalContent';
import ModalFooter from '@/components/common/form/ModalFooter';
import { fieldTypes } from './configs';
import { generateOptions } from '@/utils/helpers/global.fns';
import { MdAdd, MdDelete } from 'react-icons/md';
import useLocale from '@/utils/hooks/global/useLocale';

export default function FormJoinRequestForm({
    onClose,
    oldData,
    editMode,
    viewMode,
    isPending,
    mutate,
    options
}) {
    const { t } = useLocale();
    const { register, errors, handleSubmit, control, watch, setValue } = useRFH({
        schema,
        defaultValues: oldData || {
            name: { en: '', ar: '' },
            description: { en: '', ar: '' },
            data: { fields: [] },
            status: true
        }
    });

    // Watch the fields array
    const fields = watch('data.fields') || [];

    // Helper function to transform field key - memoized with useCallback
    const transformFieldKey = useCallback((value) => {
        if (!value) return '';
        // Replace spaces with underscores
        let transformed = value.replace(/\s+/g, '_');
        // Remove any non-English characters (keep only a-z, A-Z, 0-9, _)
        transformed = transformed.replace(/[^a-zA-Z0-9_]/g, '');
        return transformed;
    }, []);

    // Add new field
    const addField = () => {
        const newFields = [...fields, {
            key: '',
            label: { en: '', ar: '' },
            type: 'text',
            required: false,
            validation_rules: ''
        }];
        setValue('data.fields', newFields);
    };

    // Remove field
    const removeField = (index) => {
        const newFields = fields.filter((_, i) => i !== index);
        setValue('data.fields', newFields);
    };

    function onSubmit(data) {
        // Ensure data.fields is an array
        const submissionData = {
            ...data,
            data: {
                fields: data.data?.fields || []
            }
        };

        // Remove empty validation_rules
        if (submissionData.data.fields) {
            submissionData.data.fields = submissionData.data.fields.map(field => {
                const cleanedField = { ...field };
                if (!cleanedField.validation_rules || cleanedField.validation_rules.trim() === '') {
                    delete cleanedField.validation_rules;
                }
                return cleanedField;
            });
        }

        // Handle description - if both are empty, set to null
        if (submissionData.description) {
            if ((!submissionData.description.en || submissionData.description.en.trim() === '') &&
                (!submissionData.description.ar || submissionData.description.ar.trim() === '')) {
                submissionData.description = null;
            }
        }

        const finalData = editMode && oldData?.id 
            ? { ...submissionData, id: oldData.id } 
            : submissionData;
        
        mutate(finalData, {
            onSuccess: () => {
                onClose();
            }
        });
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
            <ModalContent>
                <div className="space-y-4">
                    {/* Basic Fields */}
                    <div className="space-y-2">
                        {joinRequestFormsFields
                            .filter(
                                field =>
                                    (editMode && field.editMode) ||
                                    (viewMode && field.viewMode) ||
                                    (!editMode && !viewMode)
                            )
                            .map(field => (
                                <InputRFH
                                    p="px-3 py-3"
                                    control={control}
                                    register={register}
                                    error={getNestedError(errors, field.name)}
                                    key={field.name}
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    label={field.label}
                                    name={field.name}
                                    disabled={viewMode}
                                    defaultValue={
                                        oldData?.[field.name] || field.defaultValue
                                    }
                                    required={isFieldRequired(schema, field.name)}
                                />
                            ))}
                    </div>

                    {/* Status Field */}
                    <InputRFH
                        p="px-3 py-3"
                        control={control}
                        register={register}
                        error={getNestedError(errors, 'status')}
                        type="select"
                        placeholder="validation.status.placeholder"
                        label="validation.status.label"
                        name="status"
                        disabled={viewMode}
                        defaultValue={oldData?.status ?? true}
                        options={generateOptions(options?.status)}
                        required={isFieldRequired(schema, 'status')}
                    />

                    {/* Dynamic Fields Section */}
                    <div className="space-y-3 border-t pt-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">{t('join_request_forms.form_fields')}</h3>
                            {!viewMode && (
                                <button
                                    type="button"
                                    onClick={addField}
                                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 text-sm"
                                >
                                    <MdAdd className="w-4 h-4" />
                                    {t('join_request_forms.add_field')}
                                </button>
                            )}
                        </div>

                        {fields.length === 0 && !viewMode && (
                            <p className="text-sm text-gray-500 italic">
                                {t('join_request_forms.no_fields')}
                            </p>
                        )}

                        <div className="space-y-4">
                            {fields.map((field, index) => (
                                <div key={`field-${index}`} className="border rounded-lg p-4 space-y-3 bg-gray-50">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-medium text-gray-700">
                                            {t('join_request_forms.field')} {index + 1}
                                        </span>
                                        {!viewMode && (
                                            <button
                                                type="button"
                                                onClick={() => removeField(index)}
                                                className="flex items-center gap-1 text-red-600 hover:text-red-800 font-semibold text-sm"
                                            >
                                                <MdDelete className="w-4 h-4" />
                                                {t('common.remove')}
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {/* Field Key */}
                                        <div>
                                            <Controller
                                                name={`data.fields.${index}.key`}
                                                control={control}
                                                render={({ field }) => {
                                                    return (
                                                        <div>
                                                            <label
                                                                htmlFor={`field-key-${index}`}
                                                                className="block font-medium text-gray-700 mb-1"
                                                            >
                                                                {t('validation.field_key.label')}
                                                                <span className="text-red-500 ml-1">*</span>
                                                            </label>
                                                            <input
                                                                {...field}
                                                                id={`field-key-${index}`}
                                                                type="text"
                                                                placeholder={t('validation.field_key.placeholder')}
                                                                disabled={viewMode}
                                                                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                                                onChange={(e) => {
                                                                    const transformed = transformFieldKey(e.target.value);
                                                                    field.onChange(transformed);
                                                                }}
                                                            />
                                                            {getNestedError(errors, `data.fields.${index}.key`) && (
                                                                <p className="text-red-500 text-sm mt-1">
                                                                    {t(getNestedError(errors, `data.fields.${index}.key`))}
                                                                </p>
                                                            )}
                                                            {!viewMode && (
                                                                <p className="text-xs text-gray-500 mt-1">
                                                                    {t('validation.field_key.hint')}
                                                                </p>
                                                            )}
                                                        </div>
                                                    );
                                                }}
                                            />
                                        </div>

                                        {/* Field Type */}
                                        <InputRFH
                                            p="px-3 py-3"
                                            control={control}
                                            register={register}
                                            error={getNestedError(errors, `data.fields.${index}.type`)}
                                            type="select"
                                            placeholder="validation.field_type.placeholder"
                                            label="validation.field_type.label"
                                            name={`data.fields.${index}.type`}
                                            disabled={viewMode}
                                            options={generateOptions(fieldTypes)}
                                            required={true}
                                        />
                                    </div>

                                    {/* Label (Bilingual) */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <InputRFH
                                            p="px-3 py-3"
                                            control={control}
                                            register={register}
                                            error={getNestedError(errors, `data.fields.${index}.label.en`)}
                                            type="text"
                                            placeholder="validation.label.placeholder.en"
                                            label="validation.label.label.en"
                                            name={`data.fields.${index}.label.en`}
                                            disabled={viewMode}
                                            required={true}
                                        />
                                        <InputRFH
                                            p="px-3 py-3"
                                            control={control}
                                            register={register}
                                            error={getNestedError(errors, `data.fields.${index}.label.ar`)}
                                            type="text"
                                            placeholder="validation.label.placeholder.ar"
                                            label="validation.label.label.ar"
                                            name={`data.fields.${index}.label.ar`}
                                            disabled={viewMode}
                                            required={true}
                                        />
                                    </div>

                                    {/* Required and Validation Rules */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div className="flex items-center gap-2">
                                            <InputRFH
                                                p="px-3 py-3"
                                                control={control}
                                                register={register}
                                                error={getNestedError(errors, `data.fields.${index}.required`)}
                                                type="checkbox"
                                                label="validation.required_field.label"
                                                name={`data.fields.${index}.required`}
                                                disabled={viewMode}
                                            />
                                        </div>
                                        <InputRFH
                                            p="px-3 py-3"
                                            control={control}
                                            register={register}
                                            error={getNestedError(errors, `data.fields.${index}.validation_rules`)}
                                            type="text"
                                            placeholder="validation.validation_rules.placeholder"
                                            label="validation.validation_rules.label"
                                            name={`data.fields.${index}.validation_rules`}
                                            disabled={viewMode}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </ModalContent>
            {!viewMode && (
                <ModalFooter>
                    <Btn
                        loading={isPending}
                        className="py-[10px] w-full"
                        type="submit"
                        label="common.submit"
                    />
                </ModalFooter>
            )}
        </form>
    );
}

