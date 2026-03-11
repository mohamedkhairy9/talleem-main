import useRFH from '@/utils/hooks/global/useRFH';
import { createJoinRequestFormSchema as schema } from '@/utils/yup/joinRequestForms.schemas';
import React, { useMemo, useEffect, useCallback, useState } from 'react';
import Accordion from '@/components/common/UIs/Accordion';
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
import { MdAdd, MdDelete, MdDragIndicator } from 'react-icons/md';
import useLocale from '@/utils/hooks/global/useLocale';
import { useReorderJoinRequestFormFieldsMutation } from '@/api/hooks/useJoinRequestForms';

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

    const formId = editMode && oldData?.id ? oldData.id : null;
    const canReorder = !!formId && !viewMode;
    const { mutate: reorderFields, isPending: isReorderPending } = useReorderJoinRequestFormFieldsMutation();

    const [draggedIndex, setDraggedIndex] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);
    const [draggedNested, setDraggedNested] = useState(null);
    const [dragOverNested, setDragOverNested] = useState(null);
    const [fieldsSectionOpen, setFieldsSectionOpen] = useState(true);
    const [openedFieldIndices, setOpenedFieldIndices] = useState(() => new Set());

    const toggleFieldAccordion = useCallback((originalIndex) => {
        setOpenedFieldIndices(prev => {
            const next = new Set(prev);
            if (next.has(originalIndex)) next.delete(originalIndex);
            else next.add(originalIndex);
            return next;
        });
    }, []);

    // Sync form fields when oldData changes (e.g. after reorder refetch)
    const fieldsOrderKey = useMemo(
        () => JSON.stringify((oldData?.data?.fields || []).map(f => ({ key: f.key, order: f.order }))),
        [oldData?.data?.fields]
    );
    useEffect(() => {
        if (formId && oldData?.data?.fields && Array.isArray(oldData.data.fields)) {
            setValue('data.fields', oldData.data.fields);
        }
    }, [formId, fieldsOrderKey, setValue]);

    // Sorted top-level fields for display (by order), with original index for form paths
    const sortedTopLevelFields = useMemo(() => {
        return fields
            .map((field, originalIndex) => ({ field, originalIndex }))
            .sort((a, b) => (a.field.order ?? 999) - (b.field.order ?? 999));
    }, [fields]);

    const getFieldLabel = useCallback((field) => {
        const label = field?.label;
        if (!label) return field?.key || '';
        if (typeof label === 'string') return label;
        return label.en || label.ar || field?.key || '';
    }, []);

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

    // --- Reorder: top-level
    const handleDragStart = (e, index) => {
        setDraggedIndex(index);
        setDraggedNested(null);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', index.toString());
        e.currentTarget.style.opacity = '0.5';
    };
    const handleDragOver = (e, index) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (draggedIndex !== null && draggedIndex !== index) setDragOverIndex(index);
    };
    const handleDragLeave = () => setDragOverIndex(null);
    const handleDrop = (e, dropDisplayIndex) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === dropDisplayIndex) {
            setDraggedIndex(null);
            setDragOverIndex(null);
            return;
        }
        const draggedItem = sortedTopLevelFields[draggedIndex];
        if (!draggedItem?.field?.key) {
            setDraggedIndex(null);
            setDragOverIndex(null);
            return;
        }
        const newOrder = dropDisplayIndex + 1;
        setDraggedIndex(null);
        setDragOverIndex(null);
        reorderFields(
            { id: formId, payload: { field_key: draggedItem.field.key, new_order: newOrder } },
            { onError: () => {} }
        );
    };
    const handleDragEnd = (e) => {
        e.currentTarget.style.opacity = '1';
    };

    // --- Reorder: nested (group) fields
    const nestedDragStart = (e, parentKey, nestedIndex) => {
        setDraggedNested({ parentKey, nestedIndex });
        setDraggedIndex(null);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', `${parentKey}-${nestedIndex}`);
        e.currentTarget.style.opacity = '0.5';
    };
    const nestedDragOver = (e, parentKey, nestedIndex) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (draggedNested && (draggedNested.parentKey !== parentKey || draggedNested.nestedIndex !== nestedIndex)) {
            setDragOverNested({ parentKey, nestedIndex });
        }
    };
    const nestedDragLeave = () => setDragOverNested(null);
    const nestedDrop = (e, parentKey, dropNestedIndex) => {
        e.preventDefault();
        if (!draggedNested || draggedNested.parentKey !== parentKey) {
            setDraggedNested(null);
            setDragOverNested(null);
            return;
        }
        if (draggedNested.nestedIndex === dropNestedIndex) {
            setDraggedNested(null);
            setDragOverNested(null);
            return;
        }
        const parentField = fields.find(f => f.key === parentKey);
        const nestedList = [...(parentField?.fields || [])].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
        const draggedNestedField = nestedList[draggedNested.nestedIndex];
        if (!draggedNestedField?.key) {
            setDraggedNested(null);
            setDragOverNested(null);
            return;
        }
        const newOrder = dropNestedIndex + 1;
        setDraggedNested(null);
        setDragOverNested(null);
        reorderFields(
            {
                id: formId,
                payload: { field_key: draggedNestedField.key, new_order: newOrder, parent_key: parentKey }
            },
            { onError: () => {} }
        );
    };
    const nestedDragEnd = (e) => {
        e.currentTarget.style.opacity = '1';
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

                    {/* Dynamic Fields Section – accordion for easier drag & drop */}
                    <Accordion
                        title={t('join_request_forms.form_fields')}
                        open={fieldsSectionOpen}
                        onToggle={() => setFieldsSectionOpen(prev => !prev)}
                    >
                        <div className="space-y-3">
                            {!viewMode && (
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={addField}
                                        className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 text-sm"
                                    >
                                        <MdAdd className="w-4 h-4" />
                                        {t('join_request_forms.add_field')}
                                    </button>
                                </div>
                            )}

                            {fields.length === 0 && !viewMode && (
                                <p className="text-sm text-gray-500 italic">
                                    {t('join_request_forms.no_fields')}
                                </p>
                            )}

                            <div className="space-y-4">
                            {sortedTopLevelFields.map(({ field, originalIndex }, displayIndex) => {
                                const index = originalIndex;
                                const isGroup = field?.type === 'group' && Array.isArray(field?.fields);
                                const nestedFields = isGroup ? (field.fields || []).sort((a, b) => (a.order ?? 999) - (b.order ?? 999)) : [];
                                const isDragged = canReorder && draggedIndex === displayIndex;
                                const isDragOver = canReorder && dragOverIndex === displayIndex;
                                const fieldTitle = `${t('join_request_forms.field')} ${(field.order ?? displayIndex + 1)} — ${getFieldLabel(field) || field.key || t('validation.field_key.label')}`;
                                return (
                                <div
                                    key={`field-${index}`}
                                    className={`flex items-stretch gap-0 ${isDragged ? 'opacity-50' : ''} ${isDragOver ? 'ring-2 ring-primary-500 ring-offset-1 rounded-lg' : ''}`}
                                    {...(canReorder && {
                                        draggable: true,
                                        onDragStart: (e) => handleDragStart(e, displayIndex),
                                        onDragOver: (e) => handleDragOver(e, displayIndex),
                                        onDragLeave: handleDragLeave,
                                        onDrop: (e) => handleDrop(e, displayIndex),
                                        onDragEnd: handleDragEnd
                                    })}
                                >
                                    {canReorder && (
                                        <span
                                            className="flex items-center px-2 bg-gray-100 border border-gray-200 border-r-0 rounded-l-lg cursor-move self-stretch"
                                            title={t('common.drag_to_reorder')}
                                        >
                                            <MdDragIndicator className="w-5 h-5 text-gray-400" />
                                        </span>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <Accordion
                                            title={fieldTitle}
                                            headerRight={!viewMode && (
                                                <button
                                                    type="button"
                                                    onClick={(e) => { e.stopPropagation(); removeField(index); }}
                                                    className="flex items-center gap-1 text-red-600 hover:text-red-800 font-semibold text-sm"
                                                >
                                                    <MdDelete className="w-4 h-4" />
                                                    {t('common.remove')}
                                                </button>
                                            )}
                                            open={openedFieldIndices.has(index)}
                                            onToggle={() => toggleFieldAccordion(index)}
                                        >
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

                                    {/* Nested (group) fields reorder */}
                                    {isGroup && nestedFields.length > 0 && (
                                        <div className="border-t pt-3 mt-3">
                                            <p className="text-sm font-medium text-gray-600 mb-2">{t('join_request_forms.nested_fields_order')}</p>
                                            <div className="space-y-2">
                                                {nestedFields.map((nestedField, nestedIndex) => {
                                                    const isNestedDragged = canReorder && draggedNested?.parentKey === field.key && draggedNested?.nestedIndex === nestedIndex;
                                                    const isNestedDragOver = canReorder && dragOverNested?.parentKey === field.key && dragOverNested?.nestedIndex === nestedIndex;
                                                    return (
                                                        <div
                                                            key={nestedField.key ?? nestedIndex}
                                                            className={`flex items-center gap-2 py-2 px-3 rounded border bg-white ${isNestedDragged ? 'opacity-50' : ''} ${isNestedDragOver ? 'border-primary-500 bg-primary-50' : ''}`}
                                                            {...(canReorder && {
                                                                draggable: true,
                                                                onDragStart: (e) => nestedDragStart(e, field.key, nestedIndex),
                                                                onDragOver: (e) => nestedDragOver(e, field.key, nestedIndex),
                                                                onDragLeave: nestedDragLeave,
                                                                onDrop: (e) => nestedDrop(e, field.key, nestedIndex),
                                                                onDragEnd: nestedDragEnd
                                                            })}
                                                        >
                                                            {canReorder && <MdDragIndicator className="w-4 h-4 text-gray-400 flex-shrink-0 cursor-move" />}
                                                            <span className="text-sm text-gray-700">{(nestedField.order ?? nestedIndex + 1)}. {getFieldLabel(nestedField) || nestedField.key}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                        </Accordion>
                                    </div>
                                </div>
                                );
                            })}
                            </div>
                        </div>
                    </Accordion>
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

