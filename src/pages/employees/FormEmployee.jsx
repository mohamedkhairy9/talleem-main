import useRFH from '@/utils/hooks/global/useRFH';
import { employeesSchema as schema } from '@/utils/yup/employees.schemas';
import React, { useEffect, useState } from 'react';
import { employeesFields } from './configs';
import InputRFH from '@/components/common/inputs/InputRFH';
import FileInputRFH from '@/components/common/inputs/FileInputRFH';
import Btn from '@/components/common/buttons/Btn';
import { getNestedError } from '@/utils/helpers/getNestedError';
import { generateOptions } from '@/utils/helpers/global.fns';
import { onlyDate } from '@/utils/helpers/global.fns';

export default function FormEmployee({
    onClose,
    oldData,
    editMode,
    viewMode,
    isPending,
    mutate,
    options
}) {
    const [profileImagePreview, setProfileImagePreview] = useState(
        oldData?.profile_picture || null
    );
    const [profileImageChanged, setProfileImageChanged] = useState(false);

    const { register, errors, handleSubmit, control, setValue, watch } = useRFH({
        schema,
        defaultValues: {
            ...oldData,
            name: oldData?.name || { en: '', ar: '' },
            date_of_birth: onlyDate(oldData?.date_of_birth)
        }
    });

    const cityId = watch('city_id');
    const branchId = watch('branch_id');

    useEffect(() => {
        if ((cityId && cityId != oldData?.city_id) || !oldData?.city_id) {
            setValue('branch_id', '');
            setValue('entity_id', '');
        }
    }, [cityId, oldData?.city_id, setValue]);

    useEffect(() => {
        if ((branchId && branchId != oldData?.branch_id) || !oldData?.branch_id) {
            setValue('entity_id', '');
        }
    }, [branchId, oldData?.branch_id, setValue]);

    function onSubmit(data) {
        // Remove profile_picture if not changed in edit mode
        if (editMode && !profileImageChanged && data.profile_picture) {
            delete data.profile_picture;
        }

        mutate({...data,status : data.status ? 1 : 0 }, {
            onSuccess: () => {
                onClose();
            }
        });
    }

    const renderField = field => {
        const fieldName = field.name;
        const error = getNestedError(errors, fieldName);
        const defaultValue =
            oldData?.[fieldName] || field.defaultValue;

        if (field.type === 'file') {
            if (field.name === 'profile_picture') {
                return (
                    <div className="space-y-2">
                        <InputRFH
                            p="px-3 py-3"
                            control={control}
                            register={register}
                            error={error}
                            type={field.type}
                            placeholder={field.placeholder}
                            disabled={viewMode}
                            label={field.label}
                            name={fieldName}
                            accept={field.accept}
                            onChange={e => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    setProfileImageChanged(true);
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                        setProfileImagePreview(reader.result);
                                    };
                                    reader.readAsDataURL(file);
                                }
                            }}
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
                );
            }
            return (
                <FileInputRFH
                    register={register}
                    control={control}
                    error={error}
                    placeholder={field.placeholder}
                    disabled={viewMode}
                    label={field.label}
                    name={fieldName}
                    multiple={field.multiple}
                    defaultValue={defaultValue || []}
                    setValue={setValue}
                />
            );
        }

        return (
            <InputRFH
                p="px-3 py-3"
                control={control}
                register={register}
                error={error}
                disabled={viewMode}
                {...field}
                name={fieldName}
                options={generateOptions(
                    fieldName === 'entity_id'
                        ? (options?.entity_id || []).filter(
                              e => !branchId || e.branch?.id === branchId
                          )
                        : fieldName === 'branch_id'
                        ? (options?.branch_id || []).filter(
                              b => !cityId || b.city?.id === cityId
                          )
                        : options?.[fieldName]
                )}
                defaultValue={defaultValue}
            />
        );
    };

    const filteredFields = employeesFields.filter(
        field =>
            (editMode && field.editMode) ||
            (viewMode && field.viewMode) ||
            (!editMode && !viewMode)
    );

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-4 space-y-4  overflow-y-auto"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFields.map(field => (
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
                        {renderField(field)}
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
