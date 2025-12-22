import useRFH from '@/utils/hooks/global/useRFH';
import { phasesSchema as schema } from '@/utils/yup/phases.schemas';
import React from 'react';
import { phasesFields } from './configs';
import InputRFH from '@/components/common/inputs/InputRFH';
import Btn from '@/components/common/buttons/Btn';
import { getNestedError } from '@/utils/helpers/getNestedError';
import { generateOptions } from '@/utils/helpers/global.fns';
import { isFieldRequired } from '@/utils/helpers/schemaHelpers';

export default function FormPhase({
    onClose,
    oldData,
    editMode,
    viewMode,
    isPending,
    mutate,
    options
}) {
    // Convert status from number (1/0) to boolean (true/false) for form display
    const normalizedOldData = React.useMemo(() => {
        if (!oldData) return oldData;
        return {
            ...oldData,
            status: oldData.status === 1 || oldData.status === true ? true : false
        };
    }, [oldData]);

    const { register, errors, handleSubmit, control } = useRFH({
        schema,
        defaultValues: normalizedOldData
    });

    function onSubmit(data) {
        // Convert status from boolean to number (1/0) for API
        const submissionData = {
            ...data,
            status: data.status ? 1 : 0
        };
        
        if (editMode && oldData?.id) {
            submissionData.id = oldData.id;
        }
        
        mutate(submissionData, {
            onSuccess: () => {
                onClose();
            }
        });
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-2">
            {phasesFields
                .filter(
                    field => {
                        // Remove request_type_id field from edit, view, and create modes (when set from URL)
                        if (field.name === 'request_type_id') {
                            // Hide in edit and view modes
                            if (editMode || viewMode) {
                                return false;
                            }
                            // Hide in create mode if it's set from URL
                            if (!editMode && !viewMode && normalizedOldData?.request_type_id) {
                                return false;
                            }
                        }
                        return (editMode && field.editMode) ||
                            (viewMode && field.viewMode) ||
                            (!editMode && !viewMode);
                    }
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
                            normalizedOldData?.[field.name] || field.defaultValue
                        }
                        options={generateOptions(options?.[field.name])}
                        required={isFieldRequired(schema, field.name)}
                    />
                ))}
            {!viewMode && (
                <Btn
                    loading={isPending}
                    className="py-[10px] w-full"
                    type="submit"
                    label="common.submit"
                />
            )}
        </form>
    );
}

