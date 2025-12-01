import useRFH from '@/utils/hooks/global/useRFH';
import { entityManagersSchema as schema } from '@/utils/yup/entityManagers.schemas';
import React, { useEffect, useMemo, useState } from 'react';
import { entityManagersFields } from './configs';
import InputRFH from '@/components/common/inputs/InputRFH';
import FileInputRFH from '@/components/common/inputs/FileInputRFH';
import Btn from '@/components/common/buttons/Btn';
import { getNestedError } from '@/utils/helpers/getNestedError';
import { generateOptions } from '@/utils/helpers/global.fns';
import { onlyDate } from '@/utils/helpers/global.fns';
import useLocale from '@/utils/hooks/global/useLocale';
import i18next from 'i18next';
import ModalContent from '@/components/common/form/ModalContent';
import ModalFooter from '@/components/common/form/ModalFooter';
import { isFieldRequired } from '@/utils/helpers/schemaHelpers';

export default function FormEntityManager({
    onClose,
    oldData,
    editMode,
    viewMode,
    isPending,
    mutate,
    options
}) {
    const { t } = useLocale();
    const lang = i18next.language;

    const [profileImagePreview, setProfileImagePreview] = useState(
        oldData?.profile_image || null
    );
    const [profileImageChanged, setProfileImageChanged] = useState(false);

    const { register, errors, handleSubmit, control, setValue, watch } = useRFH({
        schema,
        defaultValues: {
            ...oldData,
            date_of_birth: onlyDate(oldData?.date_of_birth),
            name: oldData?.name || { en: '', ar: '' }
        }
    });

    // Watch values
    const cityId = watch('city_id');
    const branchId = watch('branch_id');
    const mainProgramId = watch('main_program_id');

    // Filter branches based on selected city
    const filteredBranches = useMemo(() => {        
        if (!cityId || !options.branch_id) {
            return [];
        }
        
        const branches = options.branch_id;
        const filtered = branches.filter(branch => branch.city?.id === Number(cityId));
        return filtered;
    }, [cityId, options.branch_id]);

    // Filter entities based on main program AND branch
    const filteredEntities = useMemo(() => {        
        if (!mainProgramId || !options.entity_id) {
            return [];
        }

        if (!branchId) {
            return [];
        }
        
        const entities = options.entity_id;
        
        const filtered = entities.filter(entity => {
            const matchesProgram = entity.main_program?.id === Number(mainProgramId);
            
            let matchesBranch = false;
            
            if (entity.branch_id) {
                matchesBranch = entity.branch_id === Number(branchId);
            } else if (entity.branch?.id) {
                matchesBranch = entity.branch.id === Number(branchId);
            } else if (Array.isArray(entity.branches)) {
                matchesBranch = entity.branches.some(branch => 
                    branch.id === Number(branchId) || branch === Number(branchId)
                );
            }            
            return matchesProgram && matchesBranch;
        });
        return filtered;
    }, [mainProgramId, branchId, options.entity_id, lang]);

    // Reset branch and entity when city changes (only in create mode)
    useEffect(() => {
        if (!editMode && !viewMode && cityId && cityId !== oldData?.city_id) {
            setValue('branch_id', '');
            setValue('entity_id', '');
        }
    }, [cityId, oldData?.city_id, setValue, editMode, viewMode]);

    // Reset entity when branch changes (only in create mode and if city hasn't changed)
    useEffect(() => {
        if (!editMode && !viewMode && branchId && branchId !== oldData?.branch_id && cityId === oldData?.city_id) {
            setValue('entity_id', '');
        }
    }, [branchId, cityId, oldData?.branch_id, oldData?.city_id, setValue, editMode, viewMode]);

    // Reset entity when main program changes (only in create mode)
    useEffect(() => {
        if (!editMode && !viewMode && mainProgramId && mainProgramId !== oldData?.main_program_id) {
            setValue('entity_id', '');
        }
    }, [mainProgramId, oldData?.main_program_id, setValue, editMode, viewMode]);

    // Enhanced options with filtered data
    const enhancedOptions = useMemo(() => ({
        ...options,
        entity_id: filteredEntities,
        branch_id: filteredBranches
    }), [options, filteredEntities, filteredBranches]);

    function onSubmit(data) {
        const submissionData = { ...data };
        // In edit mode, if profile image not changed, don't send it
        if (editMode && !profileImageChanged) {
            delete submissionData.profile_image;
        }

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

    // Helper function to determine if a field should be disabled
    const isFieldDisabled = (fieldName) => {
        if (viewMode) return true;

        // Branch field disabled until city is selected
        if (fieldName === 'branch_id' && !cityId) {
            return true;
        }

        // Entity field disabled until branch is selected
        if (fieldName === 'entity_id' && !branchId) {
            return true;
        }

        return false;
    };

    // Helper function to get the correct options for a field
    const getFieldOptions = (fieldName) => {
        // For fields that shouldn't be filtered, always use original options
        if (['main_program_id', 'academic_qualification_id', 'major_id', 'nationality_id', 'city_id', 'gender', 'status'].includes(fieldName)) {
            return generateOptions(options[fieldName]);
        }
        
        // For filtered fields, use enhanced options
        return generateOptions(enhancedOptions[fieldName] || options[fieldName]);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
            <ModalContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {entityManagersFields
                    .filter(
                        field =>
                            (editMode && field.editMode) ||
                            (viewMode && field.viewMode) ||
                            (!editMode && !viewMode)
                    )
                    .map(field => {
                        // Special handling for branch field - disabled until city is selected
                        if (field.name === 'branch_id') {
                            const isBranchDisabled = !cityId || viewMode;
                            
                            return (
                                <div key={field.name}>
                                    <InputRFH
                                        p="px-3 py-3"
                                        control={control}
                                        register={register}
                                        error={getNestedError(errors, field.name)}
                                        type={field.type}
                                        placeholder={field.placeholder}
                                        disabled={isBranchDisabled}
                                        label={field.label}
                                        name={field.name}
                                        info={field.info}
                                        options={getFieldOptions(field.name)}
                                        defaultValue={oldData?.[field.name] || field.defaultValue}
                                        required={isFieldRequired(schema, field.name)}
                                    />
                                </div>
                            );
                        }

                        // Special handling for entity field - disabled until branch is selected
                        if (field.name === 'entity_id') {
                            const isEntityDisabled = !branchId || viewMode;
                            
                            return (
                                <div key={field.name}>
                                    <InputRFH
                                        p="px-3 py-3"
                                        control={control}
                                        register={register}
                                        error={getNestedError(errors, field.name)}
                                        type={field.type}
                                        placeholder={field.placeholder}
                                        disabled={isEntityDisabled}
                                        label={field.label}
                                        name={field.name}
                                        info={field.info}
                                        options={getFieldOptions(field.name)}
                                        defaultValue={oldData?.[field.name] || field.defaultValue}
                                        required={isFieldRequired(schema, field.name)}
                                    />
                                </div>
                            );
                        }

                        // Determine column span
                        const isFullWidth = field.type === 'textarea' || 
                                          (field.type === 'file' && field.name !== 'profile_image');

                        return (
                            <div
                                key={field.name}
                                className={isFullWidth ? 'md:col-span-2 lg:col-span-3' : ''}
                            >
                                {field.type === 'file' ? (
                                    field.name === 'profile_image' ? (
                                        <div className="space-y-2">
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
                                                accept={field.accept}
                                                required={isFieldRequired(schema, field.name)}
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
                                            control={control}
                                            error={getNestedError(errors, field.name)}
                                            placeholder={field.placeholder}
                                            disabled={viewMode}
                                            label={field.label}
                                            name={field.name}
                                            multiple={field.multiple}
                                            defaultValue={oldData?.files || []}
                                            required={isFieldRequired(schema, field.name)}
                                        />
                                    )
                                ) : (
                                    <InputRFH
                                        key={`${field.name}-${getFieldOptions(field.name)?.length || 0}`}
                                        p="px-3 py-3"
                                        control={control}
                                        register={register}
                                        error={getNestedError(errors, field.name)}
                                        type={field.type}
                                        placeholder={field.placeholder}
                                        disabled={isFieldDisabled(field.name)}
                                        label={field.label}
                                        name={field.name}
                                        options={getFieldOptions(field.name)}
                                        defaultValue={oldData?.[field.name] || field.defaultValue}
                                        info={field.info}
                                        min={field.min}
                                        max={field.max}
                                        required={isFieldRequired(schema, field.name)}
                                    />
                                )}
                            </div>
                        );
                    })}
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