import useRFH from '@/utils/hooks/global/useRFH';
import { warningsSchema as schema } from '@/utils/yup/warnings.schemas';
import React, { useMemo } from 'react';
import { warningsFields } from './configs';
import InputRFH from '@/components/common/inputs/InputRFH';
import Btn from '@/components/common/buttons/Btn';
import { getNestedError } from '@/utils/helpers/getNestedError';
import { generateOptions } from '@/utils/helpers/global.fns';
import ModalContent from '@/components/common/form/ModalContent';
import ModalFooter from '@/components/common/form/ModalFooter';
import { isFieldRequired } from '@/utils/helpers/schemaHelpers';
import useLocale from '@/utils/hooks/global/useLocale';
import i18next from 'i18next';

const RELATION_FIELDS_VIEW = ['branch_id', 'program_id', 'entity_id', 'student_id', 'teacher_id', 'warning_reason_id'];

function getRelationDisplayName(oldData, fieldName, lang) {
    const obj =
        fieldName === 'branch_id' ? oldData?.branch
            : fieldName === 'program_id' ? oldData?.program
                : fieldName === 'entity_id' ? oldData?.entity
                    : fieldName === 'student_id' ? oldData?.student
                        : fieldName === 'teacher_id' ? oldData?.teacher
                            : fieldName === 'warning_reason_id' ? oldData?.warning_reason
                                : null;
    if (!obj?.name) return '—';
    return obj.name[lang] || obj.name.en || obj.name.ar || (typeof obj.name === 'string' ? obj.name : '—');
}

export default function FormWarning({
    onClose,
    oldData,
    editMode,
    viewMode,
    isPending,
    mutate,
    options,
    assignedBranchId
}) {
    const { t } = useLocale();
    const lang = i18next.language;
    const { register, errors, handleSubmit, control, watch, setValue } = useRFH({
        schema,
        defaultValues: oldData || {
            warning_type: '',
            program_id: '',
            branch_id: '',
            entity_id: '',
            student_id: null,
            teacher_id: null,
            warning_reason_id: '',
            date: '',
            note: ''
        }
    });

    React.useEffect(() => {
        if (assignedBranchId && !editMode && !viewMode) {
            setValue('branch_id', assignedBranchId);
        }
    }, [assignedBranchId, editMode, setValue, viewMode]);

    const warningType = watch('warning_type');
    const selectedEntityId = watch('entity_id');
    const selectedProgramId = watch('program_id');
    const selectedBranchId = watch('branch_id');

    // Only use selected values for queries (edit/view: oldData used to prefill form, but we still depend on selected branch/program for fetching)
    const programIdForQuery = selectedProgramId || (editMode || viewMode ? (oldData?.program_id || oldData?.program?.id) : null);
    const branchIdForQuery = selectedBranchId || (editMode || viewMode ? (oldData?.branch_id || oldData?.branch?.id) : null);

    // Create/Edit: entity_id, student_id, teacher_id, warning_reason_id use async selects (paginated) with fieldParams below

    // Async select params: warning reasons filtered by main_program_id; students/teachers by selected entity_id
    const fieldParams = useMemo(() => ({
        entity_id: { main_program_id: programIdForQuery, branch_id: branchIdForQuery },
        student_id: { entity_id: selectedEntityId, status: true },
        teacher_id: { entity_id: selectedEntityId },
        warning_reason_id: { main_program_id: programIdForQuery }
    }), [programIdForQuery, branchIdForQuery, selectedEntityId]);

    // Reset warning_reason_id and entity_id when program changes (create mode only)
    React.useEffect(() => {
        if (selectedProgramId && !editMode) {
            setValue('warning_reason_id', '');
            setValue('entity_id', '');
        }
    }, [selectedProgramId, setValue, editMode]);

    // Reset entity_id when branch changes (create mode only)
    React.useEffect(() => {
        if (selectedBranchId && !editMode) {
            setValue('entity_id', '');
        }
    }, [selectedBranchId, setValue, editMode]);

    // عند تغيير الـ entity، نمسح الطالب أو المعلم المختار
    React.useEffect(() => {
        if (selectedEntityId && !editMode) {
            if (warningType === 'student') {
                setValue('student_id', null);
            } else if (warningType === 'teacher') {
                setValue('teacher_id', null);
            }
        }
    }, [selectedEntityId, warningType, setValue, editMode]);

    // عند تغيير warning_type، نمسح الحقول المشروطة
    React.useEffect(() => {
        if (warningType === 'student') {
            setValue('teacher_id', null);
        } else if (warningType === 'teacher') {
            setValue('student_id', null);
        } else if (warningType === 'entity') {
            setValue('student_id', null);
            setValue('teacher_id', null);
        }
    }, [warningType, setValue]);

    function onSubmit(data) {
        // تنظيف البيانات حسب نوع الإنذار
        const submissionData = { ...data };

        if (warningType === 'student') {
            delete submissionData.teacher_id;

        } else if (warningType === 'teacher') {
            delete submissionData.student_id;

        } else if (warningType === 'entity') {
            delete submissionData.student_id;
            delete submissionData.teacher_id;
        }

        const finalData = editMode ? { ...submissionData, id: oldData.id } : submissionData;
        finalData.status = true;

        mutate(finalData, {
            onSuccess: () => {
                onClose();
            }
        });
    }

    // تحديد الحقول التي ستظهر بناءً على warning_type
    const shouldShowField = (field) => {
        if (!field.conditional) return true;

        if (field.name === 'student_id') {
            return warningType === 'student';
        }

        if (field.name === 'teacher_id') {
            return warningType === 'teacher';
        }

        // entity_id يظهر دائماً
        if (field.name === 'entity_id') {
            return true;
        }

        return true;
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
            <ModalContent>
                <div className="grid grid-cols-1 gap-4">
                    {warningsFields
                        .filter(field =>
                            (editMode && field.editMode) ||
                            (viewMode && field.viewMode) ||
                            (!editMode && !viewMode)
                        )
                        .filter(shouldShowField)
                        .map(field => {
                            // View mode: render only names for relation fields (styled as form fields)
                            if (viewMode && RELATION_FIELDS_VIEW.includes(field.name)) {
                                const displayName = getRelationDisplayName(oldData, field.name, lang);
                                return (
                                    <div key={`view-${field.name}`} className="flex flex-col gap-px">
                                        <label className="flex items-center gap-2 font-medium text-gray-700 font-montserrat mb-1">
                                            {t(field.label)}
                                        </label>
                                        <div className="min-h-[44px] rounded-lg border border-gray-300 bg-gray-50 px-3 py-3 flex items-center">
                                            <span className="text-gray-900 font-montserrat">{displayName}</span>
                                        </div>
                                    </div>
                                );
                            }

                            // View mode: other fields (warning_type, date, note, status) still use InputRFH
                            const fieldOptions = options?.[field.name];
                            const isBranchOrProgram = ['branch_id', 'program_id'].includes(field.name);
                            const useAsyncSelect = !viewMode && !isBranchOrProgram && ['entity_id', 'student_id', 'teacher_id', 'warning_reason_id'].includes(field.name);

                            const idFieldFallback =
                                field.name === 'entity_id'
                                    ? oldData?.entity?.id
                                    : field.name === 'warning_reason_id'
                                      ? oldData?.warning_reason?.id
                                      : field.name === 'student_id'
                                        ? oldData?.student?.id
                                        : field.name === 'teacher_id'
                                          ? oldData?.teacher?.id
                                          : undefined;
                            const rawDefault =
                                oldData?.[field.name] ?? idFieldFallback ?? field.defaultValue;
                            const defaultValue =
                                field.name.endsWith('_id') && rawDefault != null
                                    ? Number(rawDefault)
                                    : rawDefault;

                            const asyncRemountKey =
                                field.name === 'warning_reason_id'
                                    ? programIdForQuery
                                    : field.name === 'entity_id'
                                      ? `${programIdForQuery ?? ''}-${branchIdForQuery ?? ''}`
                                      : field.name === 'student_id' || field.name === 'teacher_id'
                                        ? selectedEntityId
                                        : '';
                            const dateMaxToday = field.name === 'date' ? new Date().toISOString().split('T')[0] : undefined;
                            return (
                                <InputRFH
                                    key={`${field.name}-${viewMode ? (oldData?.id ?? 'view') : 'form'}-${asyncRemountKey ?? ''}`}
                                    p="px-3 py-3"
                                    control={control}
                                    register={register}
                                    error={getNestedError(errors, field.name)}
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    disabled={
                                        viewMode ||
                                        (field.name === 'branch_id' && Boolean(assignedBranchId)) ||
                                        (field.name === 'entity_id' && (!programIdForQuery || !branchIdForQuery)) ||
                                        (field.name === 'student_id' && !selectedEntityId) ||
                                        (field.name === 'teacher_id' && !selectedEntityId) ||
                                        (field.name === 'warning_reason_id' && !programIdForQuery)
                                    }
                                    label={field.label}
                                    name={field.name}
                                    options={generateOptions(fieldOptions)}
                                    isAsync={useAsyncSelect ? undefined : false}
                                    fieldParams={useAsyncSelect ? fieldParams : {}}
                                    oldData={oldData}
                                    defaultValue={defaultValue}
                                    min={field.minDate}
                                    max={dateMaxToday}
                                    required={isFieldRequired(schema, field.name)}
                                />
                            );
                        })}
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
