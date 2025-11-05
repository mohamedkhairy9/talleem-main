import useRFH from '@/utils/hooks/global/useRFH';
import { teachersSchema as schema } from '@/utils/yup/teachers.schemas';
import React, { useEffect } from 'react';
import { teachersFields } from './configs';
import InputRFH from '@/components/common/inputs/InputRFH';
import FileInputRFH from '@/components/common/inputs/FileInputRFH';
import Btn from '@/components/common/buttons/Btn';
import { getNestedError } from '@/utils/helpers/getNestedError';
import { generateOptions } from '@/utils/helpers/global.fns';
import { onlyDate } from '@/utils/helpers/global.fns';

export default function FormTeacher({
    onClose,
    oldData,
    editMode,
    viewMode,
    isPending,
    mutate,
    options
}) {
    const { register, errors, handleSubmit, control, setValue, watch } = useRFH(
        {
            schema,
            defaultValues: {
                ...oldData,
                dob: onlyDate(oldData?.dob)
            }
        }
    );

    const cityId = watch('city_id');
    const branchId = watch('branch_id');
    const mainProgramId = watch('main_program_id');

    console.log(errors);

    useEffect(() => {
        if ((cityId && cityId != oldData?.city_id) || !oldData?.city_id) {
            setValue('branch_id', '');
            setValue('entity_id', '');
        }
    }, [cityId, oldData?.city_id, setValue]);

    useEffect(() => {
        if (
            (branchId && branchId != oldData?.branch_id) ||
            !oldData?.branch_id
        ) {
            setValue('entity_id', '');
        }
    }, [branchId, oldData?.branch_id, setValue]);

    useEffect(() => {
        if (
            (mainProgramId && mainProgramId != oldData?.main_program_id) ||
            !oldData?.main_program_id
        ) {
            setValue('program_entity_types', '');
        }
    }, [mainProgramId, oldData?.main_program_id, setValue]);

    const enhancedOptions = {
        ...options,
        branch_id:
            options.branch_id?.filter(branch => branch.city?.id === cityId) ||
            [],
        program_entity_types:
            mainProgramId === 1
                ? options.education_program_entity_type_id
                : mainProgramId === 2
                ? options.memorization_program_entity_type_id
                : []
    };

    function onSubmit(data) {
        const payload = {
            ...data,
            // Map program_entity_types to the correct key based on main program
            ...(data.main_program_id == 1
                ? {
                      education_program_entity_type_id:
                          data.program_entity_types
                  }
                : data.main_program_id == 2
                ? {
                      memorization_program_entity_type_id:
                          data.program_entity_types
                  }
                : {})
        };

        // Remove helper field
        delete payload.program_entity_types;

        // Map profile image key to requested shape if present
        if (payload.profile_image && !payload.profile_picture) {
            payload.profile_picture = payload.profile_image;
            delete payload.profile_image;
        }

        mutate(payload, {
            onSuccess: () => {
                onClose();
            }
        });
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teachersFields
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
                                field.type === 'textarea'
                                    ? 'md:col-span-2 lg:col-span-3'
                                    : field.type === 'file'
                                    ? 'md:col-span-2 lg:col-span-3'
                                    : ''
                            }
                        >
                            {field.type === 'file' &&
                            field.name !== 'profile_image' ? (
                                <FileInputRFH
                                    register={register}
                                    control={control}
                                    error={getNestedError(errors, field.name)}
                                    placeholder={field.placeholder}
                                    disabled={viewMode}
                                    label={field.label}
                                    name={field.name}
                                    multiple={field.multiple}
                                    defaultValue={oldData?.files || []}
                                />
                            ) : (
                                <InputRFH
                                    info={field.info}
                                    p="px-3 py-3"
                                    control={control}
                                    register={register}
                                    error={getNestedError(errors, field.name)}
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    disabled={viewMode}
                                    label={field.label}
                                    name={field.name}
                                    options={generateOptions(
                                        enhancedOptions?.[field.name]
                                    )}
                                    defaultValue={
                                        oldData?.[field.name] ||
                                        field.defaultValue
                                    }
                                />
                            )}
                        </div>
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
