import useRFH from '@/utils/hooks/global/useRFH';
import { warningsSchema as schema } from '@/utils/yup/warnings.schemas';
import React, { useMemo } from 'react';
import { warningsFields } from './configs';
import InputRFH from '@/components/common/inputs/InputRFH';
import Btn from '@/components/common/buttons/Btn';
import { getNestedError } from '@/utils/helpers/getNestedError';
import { generateOptions } from '@/utils/helpers/global.fns';
import { useQuery } from '@tanstack/react-query';
import { studentsService } from '@/api/services/students.service';
import { teachersService } from '@/api/services/teachers.service';
import { API_KEYS } from '@/api/endpoints';
import ModalContent from '@/components/common/form/ModalContent';
import ModalFooter from '@/components/common/form/ModalFooter';
import { isFieldRequired } from '@/utils/helpers/schemaHelpers';
import { useWarningReasonsQuery } from '@/api/hooks/useWarningReasons';
import { useEntitiesQuery } from '@/api/hooks/useEntities';

export default function FormWarning({
    onClose,
    oldData,
    editMode,
    viewMode,
    isPending,
    mutate,
    options
}) {
    const { register, errors, handleSubmit, control, watch, setValue } = useRFH({
        schema,
        defaultValues: oldData || {
            status: true,
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

    const warningType = watch('warning_type');
    const selectedEntityId = watch('entity_id');
    const selectedProgramId = watch('program_id');
    const selectedBranchId = watch('branch_id');

    // Get program and branch IDs from oldData for edit/view mode
    const programIdForQuery = selectedProgramId || oldData?.program_id || oldData?.program?.id;
    const branchIdForQuery = selectedBranchId || oldData?.branch_id || oldData?.branch?.id;

    // Fetch entities dynamically based on selected program and branch
    const entitiesQueryParams = useMemo(() => {
        if (!programIdForQuery || !branchIdForQuery) {
            return null;
        }
        return {
            program_id: programIdForQuery,
            branch_id: branchIdForQuery
        };
    }, [programIdForQuery, branchIdForQuery]);

    const { data: entitiesData } = useEntitiesQuery(entitiesQueryParams || {}, {
        enabled: !!entitiesQueryParams
    });

    const entitiesOptions = useMemo(() => {
        const allEntities = entitiesData?.data || [];

        // In view/edit mode, include selected entity even if not in fetched results
        if ((viewMode || editMode) && oldData?.entity) {
            const selectedEntity = oldData.entity;
            if (selectedEntity?.id && !allEntities.some(e => e.id === selectedEntity.id)) {
                return [selectedEntity, ...allEntities];
            }
        }

        return allEntities;
    }, [entitiesData, viewMode, editMode, oldData?.entity]);

    // جلب الطلاب بناءً على الـ entity المختارة
    const { data: studentsData } = useQuery({
        queryKey: [API_KEYS.STUDENTS, { entity_id: selectedEntityId }],
        queryFn: () => studentsService.getStudents({ 
            entity_id: selectedEntityId
        }),
        enabled: !!selectedEntityId && warningType === 'student'
    });

    // جلب المعلمين بناءً على الـ entity المختارة
    const { data: teachersData } = useQuery({
        queryKey: [API_KEYS.TEACHERS, { entity_id: selectedEntityId }],
        queryFn: () => teachersService.getTeachers({ 
            entity_id: selectedEntityId
        }),
        enabled: !!selectedEntityId && warningType === 'teacher'
    });

    // Fetch warning reasons dynamically based on selected program
    const { data: warningReasonsData } = useWarningReasonsQuery(
        { main_program_id: programIdForQuery },
        { enabled: !!programIdForQuery }
    );

    const warningReasonsOptions = useMemo(() => {
        const allReasons = warningReasonsData?.data || [];

        // In view/edit mode, include selected warning reason even if not in fetched results
        if ((viewMode || editMode) && oldData?.warning_reason) {
            const selectedReason = oldData.warning_reason;
            if (selectedReason?.id && !allReasons.some(r => r.id === selectedReason.id)) {
                return [selectedReason, ...allReasons];
            }
        }

        return allReasons;
    }, [warningReasonsData, viewMode, editMode, oldData?.warning_reason]);

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
        console.log('data', data);

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
                            let fieldOptions = options?.[field.name];

                            // إذا كان الحقل entity_id، استخدم الـ entities المفلترة حسب الـ program
                            if (field.name === 'entity_id') {
                                fieldOptions = entitiesOptions;
                            }

                            // إذا كان الحقل student_id، استخدم الطلاب المفلترين حسب الـ entity
                            if (field.name === 'student_id') {
                                fieldOptions = studentsData?.data || [];
                            }

                            // إذا كان الحقل teacher_id، استخدم المعلمين المفلترين حسب الـ entity
                            if (field.name === 'teacher_id') {
                                fieldOptions = teachersData?.data || [];
                            }

                            // إذا كان الحقل warning_reason_id، استخدم الأسباب المفلترة حسب الـ program
                            if (field.name === 'warning_reason_id') {
                                fieldOptions = warningReasonsOptions;
                            }

                            return (
                                <InputRFH
                                    key={field.name}
                                    p="px-3 py-3"
                                    control={control}
                                    register={register}
                                    error={getNestedError(errors, field.name)}
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    disabled={
                                        viewMode ||
                                        (field.name === 'entity_id' && (!programIdForQuery || !branchIdForQuery)) ||
                                        (field.name === 'student_id' && !selectedEntityId) ||
                                        (field.name === 'teacher_id' && !selectedEntityId) ||
                                        (field.name === 'warning_reason_id' && !programIdForQuery)
                                    }
                                    label={field.label}
                                    name={field.name}
                                    options={generateOptions(fieldOptions)}
                                    defaultValue={
                                        oldData?.[field.name] || field.defaultValue
                                    }
                                    min={field.minDate}
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