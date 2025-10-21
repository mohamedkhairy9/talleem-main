import useRFH from '@/utils/hooks/global/useRFH';
import { usersSchema as schema } from '@/utils/yup/users.schemas';
import React from 'react';
import { usersFields } from './configs';
import InputRFH from '@/components/common/inputs/InputRFH';
import Btn from '@/components/common/buttons/Btn';
import { getNestedError } from '@/utils/helpers/getNestedError';
import { generateOptions, prepareFormData } from '@/utils/helpers/global.fns';

export default function FormUser({
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

        // Add static user_type for all requests
        const userData = {
            ...data,
            user_type: 'employee' // Static constant as specified
        };

        mutate(userData, {
            onSuccess: () => {
                onClose();
            }
        });
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {usersFields
                    .filter(
                        field =>
                            (editMode && field.editMode) ||
                            (viewMode && field.viewMode) ||
                            (!editMode && !viewMode)
                    )
                    .map(field => (
                        <div
                            key={field.name}
                            className={
                                field.type === 'textarea' ? 'md:col-span-2' : ''
                            }
                        >
                            <InputRFH
                                p="px-3 py-3"
                                control={control}
                                register={register}
                                error={getNestedError(errors, field.name)}
                                type={field.type}
                                placeholder={field.placeholder}
                                disabled={viewMode}
                                label={field.label}
                                name={field.name}
                                defaultValue={
                                    oldData?.[field.name] || field.defaultValue
                                }
                                options={generateOptions(options?.[field.name])}
                            />
                        </div>
                    ))}
            </div>
            {!viewMode && (<Btn
                loading={isPending}
                className="py-[10px] w-full"
                type="submit"
                label="common.submit"
            />)}
        </form>
    );
}
