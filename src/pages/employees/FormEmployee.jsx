import useRFH from '@/utils/hooks/global/useRFH';
import { employeesSchema as schema } from '@/utils/yup/employees.schemas';
import React, { useEffect, useMemo, useState } from 'react';
import { employeesFields } from './configs';
import InputRFH from '@/components/common/inputs/InputRFH';
import FileInputRFH from '@/components/common/inputs/FileInputRFH';
import Btn from '@/components/common/buttons/Btn';
import { getNestedError } from '@/utils/helpers/getNestedError';
import { generateOptions } from '@/utils/helpers/global.fns';
import { onlyDate } from '@/utils/helpers/global.fns';
import ModalContent from '@/components/common/form/ModalContent';
import ModalFooter from '@/components/common/form/ModalFooter';
import { isFieldRequired } from '@/utils/helpers/schemaHelpers';
import { useEntitiesQuery } from '@/api/hooks/useEntities';
import { allData } from '@/utils/constants/global.constants';

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

    // Filter branches by selected city
    const filteredBranches = useMemo(() => {
        if (!cityId || !options.branch_id) return [];
        return options.branch_id.filter(branch => branch.city?.id === Number(cityId));
    }, [cityId, options.branch_id]);

    // Fetch entities dynamically based on selected branch
    const { data: entitiesData, isLoading: entitiesLoading } = useEntitiesQuery(
        {
            ...allData,
            branch_id: branchId
        },
        {
            enabled: !!branchId
        }
    );

    // Get entities from the dynamic query
    const entities = useMemo(() => entitiesData?.data || [], [entitiesData?.data]);

    const enhancedOptions = useMemo(() => ({
        ...options,
        branch_id: filteredBranches,
        entity_id: entities
    }), [options, filteredBranches, entities]);

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

        // Extract single file from FileList for profile_picture
        if (data.profile_picture instanceof FileList && data.profile_picture.length > 0) {
            data.profile_picture = data.profile_picture[0];
        } else if (Array.isArray(data.profile_picture) && data.profile_picture.length > 0) {
            data.profile_picture = data.profile_picture[0];
        }

        mutate({...data, status: data.status ? 1 : 0}, {
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
                            required={isFieldRequired(schema, fieldName)}
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
                    required={isFieldRequired(schema, fieldName)}
                />
            );
        }

        // Determine if field should be disabled based on dependencies
        const isFieldDisabled = viewMode || 
            (fieldName === 'branch_id' && !cityId) ||
            (fieldName === 'entity_id' && !branchId);

        return (
            <InputRFH
                p="px-3 py-3"
                control={control}
                register={register}
                error={error}
                disabled={isFieldDisabled}
                {...field}
                name={fieldName}
                options={generateOptions(enhancedOptions?.[fieldName] || options?.[fieldName])}
                defaultValue={defaultValue}
                required={isFieldRequired(schema, fieldName)}
                loading={fieldName === 'entity_id' ? entitiesLoading : false}
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
            className="flex flex-col h-full"
        >
            <ModalContent>
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
            </ModalContent>
            {!viewMode && (
                <ModalFooter>
                    <Btn
                        loading={isPending}
                        className="py-[10px] w-full"
                        type="submit"
                        label="common.submit"
                    />
                </ModalFooter>
            )}
        </form>
    );
}
