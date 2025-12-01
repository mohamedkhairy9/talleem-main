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
    const selectedBranchId = watch('branch_id');
    const selectedEntityId = watch('entity_id');

    // فلترة الـ entities حسب الـ branch المختار
    const filteredEntities = useMemo(() => {
        if (!selectedBranchId || !options?.entity_id) {
            return options?.entity_id || [];
        }

        return options.entity_id.filter(entity => {
            return entity?.branch?.id === selectedBranchId;
        });
    }, [selectedBranchId, options?.entity_id]);

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

    // عند تغيير الـ branch، نمسح الـ entity المختارة
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

                            // إذا كان الحقل entity_id، استخدم الـ entities المفلترة
                            if (field.name === 'entity_id') {
                                fieldOptions = filteredEntities;
                            }

                            // إذا كان الحقل student_id، استخدم الطلاب المفلترين حسب الـ entity
                            if (field.name === 'student_id') {
                                fieldOptions = studentsData?.data || [];
                            }

                            // إذا كان الحقل teacher_id، استخدم المعلمين المفلترين حسب الـ entity
                            if (field.name === 'teacher_id') {
                                fieldOptions = teachersData?.data || [];
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
                                        (field.name === 'entity_id' && !selectedBranchId) ||
                                        (field.name === 'student_id' && !selectedEntityId) ||
                                        (field.name === 'teacher_id' && !selectedEntityId)
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