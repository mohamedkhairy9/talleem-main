import useRFH from '@/utils/hooks/global/useRFH';
import { branchesSchema as schema } from '@/utils/yup/branches.schemas';
import React, { useEffect } from 'react';
import { branchesFields } from './configs';
import InputRFH from '@/components/common/inputs/InputRFH';
import Btn from '@/components/common/buttons/Btn';
import { getNestedError } from '@/utils/helpers/getNestedError';
import { generateOptions } from '@/utils/helpers/global.fns';

export default function FormBranch({
    onClose,
    oldData,
    editMode,
    viewMode,
    isPending,
    mutate,
    options
}) {
    const { register, errors, handleSubmit, control, reset } = useRFH({
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

    console.log('options', options);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-2">
            {branchesFields
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
                        defaultValue={oldData?.[field.name]}
                        options={generateOptions(options?.[field.name])}
                    />
                ))}
            <Btn
                loading={isPending}
                className="py-[10px] w-full"
                type="submit"
                label="common.submit"
            />
        </form>
    );
}
