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
    const { register, errors, handleSubmit, control } = useRFH({
        schema,
        defaultValues: oldData
    });

    function onSubmit(data) {
        const submissionData = editMode && oldData?.id 
            ? { ...data, id: oldData.id } 
            : data;
        mutate(submissionData, {
            onSuccess: () => {
                onClose();
            }
        });
    }

    // Hide request_type_id field in create mode (it's set from URL)
    // Disable it in edit mode (shouldn't be changed)
    const shouldHideRequestTypeId = !editMode && !viewMode && oldData?.request_type_id;
    const shouldDisableRequestTypeId = editMode;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-2">
            {phasesFields
                .filter(
                    field => {
                        // Hide request_type_id in create mode if it's set from URL
                        if (field.name === 'request_type_id' && shouldHideRequestTypeId) {
                            return false;
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
                        disabled={
                            viewMode || 
                            (field.name === 'request_type_id' && shouldDisableRequestTypeId)
                        }
                        defaultValue={
                            oldData?.[field.name] || field.defaultValue
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

