import useRFH from '@/utils/hooks/global/useRFH';
import { entityManagersSchema as schema } from '@/utils/yup/entityManagers.schemas';
import React, { useMemo, useState } from 'react';
import { entityManagersFields } from './configs';
import InputRFH from '@/components/common/inputs/InputRFH';
import FileInputRFH from '@/components/common/inputs/FileInputRFH';
import Btn from '@/components/common/buttons/Btn';
import { getNestedError } from '@/utils/helpers/getNestedError';
import { generateOptions, prepareFormData } from '@/utils/helpers/global.fns';
import { onlyDate } from '@/utils/helpers/global.fns';
import useFilterBranch from '@/utils/hooks/global/useFilterBranches';

export default function FormEntityManager({
    onClose,
    oldData,
    editMode,
    viewMode,
    isPending,
    mutate,
    options
}) {
    const { register, errors, handleSubmit, control, setValue, watch } = useRFH({
        schema,
        defaultValues: {
            ...oldData,
            date_of_birth: onlyDate(oldData?.date_of_birth),
            name: oldData?.name || { en: '', ar: '' }
        }
    });
    const [profileImagePreview, setProfileImagePreview] = useState(
        oldData?.profile_image || null
    );
    const [profileImageChanged, setProfileImageChanged] = useState(false);

    const cityId = watch('city_id');
    const filteredBranches = useFilterBranch('city', cityId, options.branch_id);

    function onSubmit(data) {
        console.log('data', data);

        if (editMode && !profileImageChanged) {
            delete data.profile_image;
        }

        const submissionData = data;

        mutate(submissionData, {
            onSuccess: () => {
                onClose();
            }
        });
    }

    const handleProfileImageChange = e => {
        const file = e.target.files?.[0];
        if (file) {
            setProfileImageChanged(true);
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    console.log('oldData', oldData);

    const mainProgramId = watch('main_program_id');

    const filteredEntities = useMemo(() => {
        console.log("main program id:", mainProgramId)
        const entities = options.entity_id;
        if(!mainProgramId) return [];
        console.log("my entities:", entities);
        const en =  entities
            .filter(entity => {
                return entity.main_program.id === mainProgramId;
            })
            console.log("ents.", en)
            return en;
    }, [mainProgramId])

    const enhancedOptions = {
        ...options,
        entity_id: filteredEntities,
        branch_id: filteredBranches
    }

    console.log("enhanced options", enhancedOptions)

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {entityManagersFields
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
                            {field.type === 'file' ? (
                                field.name === 'profile_image' ? (
                                    <div className="space-y-2">
                                        <InputRFH
                                            p="px-3 py-3"
                                            control={control}
                                            register={register}
                                            error={getNestedError(
                                                errors,
                                                field.name
                                            )}
                                            type={field.type}
                                            placeholder={field.placeholder}
                                            disabled={viewMode}
                                            label={field.label}
                                            name={field.name}
                                            accept={field.accept}
                                            onChange={handleProfileImageChange}
                                        />
                                        {profileImagePreview && (
                                            <div className="mt-2">
                                                <img
                                                    src={profileImagePreview}
                                                    alt="Profile Preview"
                                                    className="h-32 w-32 object-cover rounded-full border-2 border-gray-300"
                                                />
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <FileInputRFH
                                        setValue={setValue}
                                        register={register}
                                        error={getNestedError(
                                            errors,
                                            field.name
                                        )}
                                        placeholder={field.placeholder}
                                        disabled={viewMode}
                                        label={field.label}
                                        name={field.name}
                                        multiple={field.multiple}
                                        defaultValue={oldData?.files || []}
                                    />
                                )
                            ) : (
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
                                    options={generateOptions(
                                        enhancedOptions?.[field.name]
                                    )}
                                    defaultValue={
                                        oldData?.[field.name] || field.defaultValue
                                    }
                                    info={field.info}
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
