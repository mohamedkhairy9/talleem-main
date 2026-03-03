import useRFH from '@/utils/hooks/global/useRFH';
import { examSegmentsCountSchema as schema } from '@/utils/yup/examSegmentsCount.schemas';
import React from 'react';
import { examSegmentsCountFields } from './configs';
import InputRFH from '@/components/common/inputs/InputRFH';
import Btn from '@/components/common/buttons/Btn';
import { getNestedError } from '@/utils/helpers/getNestedError';
import { generateOptions } from '@/utils/helpers/global.fns';
import { isFieldRequired } from '@/utils/helpers/schemaHelpers';

export default function FormExamSegmentsCount({
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
        defaultValues: {
            ...oldData,
            name: oldData?.name || { en: '', ar: '' }
        }
    });

    function onSubmit(data) {
        // Convert is_active to number (0 or 1)
        const submissionData = {
            ...data,
            is_active: data.is_active ? 1 : 0
        };

        const finalData = editMode 
            ? { ...submissionData, id: oldData.id } 
            : submissionData;

        mutate(finalData, {
            onSuccess: () => {
                onClose();
            }
        });
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
            <div className="grid grid-cols-1 gap-4">
                {examSegmentsCountFields
                    .filter(
                        field =>
                            (editMode && field.editMode) ||
                            (viewMode && field.viewMode) ||
                            (!editMode && !viewMode)
                    )
                    .map(field => (
                        <InputRFH
                            key={field.name}
                            p="px-3 py-3"
                            control={control}
                            register={register}
                            error={getNestedError(errors, field.name)}
                            type={field.type}
                            placeholder={field.placeholder}
                            disabled={viewMode}
                            label={field.label}
                            name={field.name}
                            options={generateOptions(options?.[field.name])}
                            defaultValue={
                                field.name.includes('.')
                                    ? field.name.split('.').reduce((obj, key) => obj?.[key], oldData) || field.defaultValue
                                    : oldData?.[field.name] || field.defaultValue
                            }
                            min={field.min}
                            max={field.max}
                            required={isFieldRequired(schema, field.name)}
                        />
                    ))}
            </div>
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