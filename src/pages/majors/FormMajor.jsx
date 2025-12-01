import useRFH from '@/utils/hooks/global/useRFH';
import { majorsSchema as schema } from '@/utils/yup/majors.schemas';
import React from 'react';
import { majorsFields } from './configs';
import InputRFH from '@/components/common/inputs/InputRFH';
import Btn from '@/components/common/buttons/Btn';
import { getNestedError } from '@/utils/helpers/getNestedError';
import { generateOptions } from '@/utils/helpers/global.fns';
import { isFieldRequired } from '@/utils/helpers/schemaHelpers';

export default function FormMajor({
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
        console.log('data', data);
        mutate(data, {
            onSuccess: () => {
                onClose();
            }
        });
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-2">
            {majorsFields
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
                        disabled={viewMode}
                        label={field.label}
                        name={field.name}
                        defaultValue={
                            oldData?.[field.name] || field.defaultValue
                        }
                        options={generateOptions(options?.[field.name])}
                    required={isFieldRequired(schema, field.name)}
                    />
                ))}
            {!viewMode && (<Btn
                loading={isPending}
                className="py-[10px] w-full"
                type="submit"
                label="common.submit"
            />)}
        </form>
    );
}
