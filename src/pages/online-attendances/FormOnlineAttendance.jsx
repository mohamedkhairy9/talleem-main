import useRFH from '@/utils/hooks/global/useRFH';
import { onlineAttendancesSchema as schema } from '@/utils/yup/onlineAttendances.schemas';
import React from 'react';
import { onlineAttendancesFields } from './configs';
import InputRFH from '@/components/common/inputs/InputRFH';
import Btn from '@/components/common/buttons/Btn';
import { getNestedError } from '@/utils/helpers/getNestedError';
import { generateOptions } from '@/utils/helpers/global.fns';

export default function FormOnlineAttendance({
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
        // Build the submit data based on attendance type
        const submitData = {
            user_id: data.user_id,
            status: true
        };

        // Parse datetime-local value and send as single key
        if (data.attendance_type === 'check_in') {
            submitData.check_in = data.attendance_datetime;
        } else if (data.attendance_type === 'check_out') {
            submitData.check_out = data.attendance_datetime;
        }

        console.log('submitData', submitData);
        mutate(submitData, {
            onSuccess: () => {
                onClose();
            }
        });
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-2">
            {onlineAttendancesFields
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
