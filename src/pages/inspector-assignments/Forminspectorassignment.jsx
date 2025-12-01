import useRFH from '@/utils/hooks/global/useRFH';
import { inspectorAssignmentsSchema as schema } from '@/utils/yup/inspectorAssignments.schemas';
import React, { useMemo } from 'react';
import { inspectorAssignmentsFields } from './configs';
import InputRFH from '@/components/common/inputs/InputRFH';
import Btn from '@/components/common/buttons/Btn';
import { getNestedError } from '@/utils/helpers/getNestedError';
import { generateOptions } from '@/utils/helpers/global.fns';
import ModalContent from '@/components/common/form/ModalContent';
import ModalFooter from '@/components/common/form/ModalFooter';
import { isFieldRequired } from '@/utils/helpers/schemaHelpers';

export default function FormInspectorAssignment({
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
            assignment_type: 'regular',
            main_program_id: '',
            branch_id: '',
            entity_ids: [],
            supervisor_ids: '',
            from_date: '',
            to_date: '',
            notes: ''
        }
    });

    const assignmentType = watch('assignment_type');
    const selectedBranchId = watch('branch_id');

    const filteredEntities = useMemo(() => {
        if (!selectedBranchId || !options?.entity_ids) {
            return options?.entity_ids || [];
        }

        return options.entity_ids.filter(entity => {
            return entity?.branch?.id === selectedBranchId;
        });
    }, [selectedBranchId, options?.entity_ids]);

    // عند تغيير الـ branch، نمسح الـ entities المختارة
    React.useEffect(() => {
        if (selectedBranchId && !editMode) {
            setValue('entity_ids', []);
        }
    }, [selectedBranchId, setValue, editMode]);

    // عند تغيير assignment_type، نمسح المشرفين لتجنب تعارض single/multi select
    React.useEffect(() => {
        if (!editMode) {
            // مسح المشرفين عند تغيير نوع التكليف لتجنب مشاكل التوافق بين single و multi select
            setValue('supervisor_ids', assignmentType === 'committee' ? [] : '');
        }
    }, [assignmentType, setValue, editMode]);

    function onSubmit(data) {
        console.log('data', data);
        
        const submissionData = {
            ...data,
            entity_ids: Array.isArray(data.entity_ids) ? data.entity_ids : [data.entity_ids],
            supervisor_ids: Array.isArray(data.supervisor_ids) ? data.supervisor_ids : [data.supervisor_ids]
        };
        
        const finalData = editMode ? { ...submissionData, id: oldData.id } : submissionData;
        
        mutate(finalData, {
            onSuccess: () => {
                onClose();
            }
        });
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
            <ModalContent>
            <div className="grid grid-cols-1 gap-4">
                {inspectorAssignmentsFields
                    .filter(
                        field =>
                            (editMode && field.editMode) ||
                            (viewMode && field.viewMode) ||
                            (!editMode && !viewMode)
                    )
                    .map(field => {
                        let fieldType = field.type;
                        let isMultiple = false;
                        let fieldOptions = options?.[field.name];

                        if (field.name === 'entity_ids') {
                            fieldOptions = filteredEntities;
                            isMultiple = true;
                        }

                        if (field.name === 'supervisor_ids') {
                            isMultiple = assignmentType === 'committee';
                        }

                        return (
                            <InputRFH
                                key={field.name}
                                p="px-3 py-3"
                                control={control}
                                register={register}
                                error={getNestedError(errors, field.name)}
                                type={fieldType}
                                placeholder={field.placeholder}
                                disabled={viewMode || (field.name === 'entity_ids' && !selectedBranchId)}
                                label={field.label}
                                name={field.name}
                                options={generateOptions(fieldOptions)}
                                defaultValue={
                                    oldData?.[field.name] || field.defaultValue
                                }
                                isMulti={isMultiple}
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