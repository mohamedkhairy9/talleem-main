import useRFH from '@/utils/hooks/global/useRFH';
import { requestTypesSchema as schema } from '@/utils/yup/requestTypes.schemas';
import React from 'react';
import { requestTypesFields } from './configs';
import InputRFH from '@/components/common/inputs/InputRFH';
import Btn from '@/components/common/buttons/Btn';
import { getNestedError } from '@/utils/helpers/getNestedError';
import { isFieldRequired } from '@/utils/helpers/schemaHelpers';

export default function FormRequestType({
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

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-2">
            {requestTypesFields
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

