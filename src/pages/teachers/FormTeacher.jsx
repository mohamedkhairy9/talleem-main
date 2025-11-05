import useRFH from '@/utils/hooks/global/useRFH';
import { teachersSchema as schema } from '@/utils/yup/teachers.schemas';
import React, { useEffect } from 'react';
import { teachersFields } from './configs';
import InputRFH from '@/components/common/inputs/InputRFH';
import FileInputRFH from '@/components/common/inputs/FileInputRFH';
import Btn from '@/components/common/buttons/Btn';
import { getNestedError } from '@/utils/helpers/getNestedError';
import {
    generateOptions,
    getUniqueOptionsByName,
    generateOptionsWithCustomLabel
} from '@/utils/helpers/global.fns';
import i18next from 'i18next';
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
    const educationClassification = watch(
        'education_program_entity_type_classification'
    );

    // Get unique options by name for education program entity types (for mainProgramId === 1)
    const uniqueEducationClassifications = getUniqueOptionsByName(
        options.education_program_entity_type_id || []
    );

    // Filter entity categories based on selected classification (for mainProgramId === 1)
    const filteredEntityCategories =
        Number(mainProgramId) === 1 && educationClassification
            ? (() => {
                  const lang = i18next.language;
                  const selectedClassification =
                      uniqueEducationClassifications.find(
                          u =>
                              u.id === educationClassification ||
                              u.value === educationClassification
                      );

                  if (!selectedClassification) return [];

                  const selectedName =
                      selectedClassification.name?.[lang] ||
                      selectedClassification.name?.en ||
                      selectedClassification.name?.ar ||
                      selectedClassification.name;

                  return (
                      options.education_program_entity_type_id || []
                  ).filter(opt => {
                      const optName =
                          opt.name?.[lang] ||
                          opt.name?.en ||
                          opt.name?.ar ||
                          opt.name;
                      return optName === selectedName;
                  });
              })()
            : [];

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
            setValue('education_program_entity_type_classification', '');
            setValue('entity_category_id', '');
        }
    }, [mainProgramId, oldData?.main_program_id, setValue]);

    useEffect(() => {
        if (Number(mainProgramId) === 1) {
            if (
                (educationClassification &&
                    educationClassification !=
                        oldData?.education_program_entity_type_classification) ||
                !oldData?.education_program_entity_type_classification
            ) {
                setValue('entity_category_id', '');
            }
        }
    }, [
        educationClassification,
        mainProgramId,
        oldData?.education_program_entity_type_classification,
        setValue
    ]);

    // Set the classification value when editing (based on entity_category_id's name)
    useEffect(() => {
        if (
            Number(mainProgramId) === 1 &&
            oldData?.entity_category_id &&
            !oldData?.education_program_entity_type_classification
        ) {
            // Find the entity type that matches entity_category_id
            const selectedEntityType = (
                options.education_program_entity_type_id || []
            ).find(opt => opt.id === oldData.entity_category_id);

            if (selectedEntityType) {
                // Find the unique classification that matches this entity type's name
                const lang = i18next.language;
                const selectedName =
                    selectedEntityType.name?.[lang] ||
                    selectedEntityType.name?.en ||
                    selectedEntityType.name?.ar ||
                    selectedEntityType.name;
                const matchingUniqueClassification =
                    uniqueEducationClassifications.find(u => {
                        const uName =
                            u.name?.[lang] ||
                            u.name?.en ||
                            u.name?.ar ||
                            u.name;
                        return uName === selectedName;
                    });

                if (matchingUniqueClassification) {
                    setValue(
                        'education_program_entity_type_classification',
                        matchingUniqueClassification.id ||
                            matchingUniqueClassification.value
                    );
                }
            }
        }
    }, [
        mainProgramId,
        oldData,
        options.education_program_entity_type_id,
        uniqueEducationClassifications,
        setValue
    ]);

    const enhancedOptions = {
        ...options,
        branch_id:
            options.branch_id?.filter(branch => branch.city?.id === cityId) ||
            [],
        education_program_entity_type_classification:
            Number(mainProgramId) === 1 ? uniqueEducationClassifications : [],
        entity_category_id:
            Number(mainProgramId) === 1
                ? educationClassification
                    ? generateOptionsWithCustomLabel(
                          filteredEntityCategories,
                          'educational_entity_classification'
                      )
                    : []
                : Number(mainProgramId) === 2
                ? options.memorization_program_entity_type_id || []
                : []
    };

    function onSubmit(data) {
        const { education_program_entity_type_classification: _helper, ...rest } = data;
        const payload = {
            ...rest,
            ...(Number(rest.main_program_id) === 1
                ? { education_program_entity_type_id: rest.entity_category_id }
                : Number(rest.main_program_id) === 2
                ? { memorization_program_entity_type_id: rest.entity_category_id }
                : {})
        };

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

    const filteredTeacherFields = teachersFields.filter(field => {
        // Check edit/view mode
        const modeMatch =
            (editMode && field.editMode) ||
            (viewMode && field.viewMode) ||
            (!editMode && !viewMode);

        if (!modeMatch) return false;

        // Check conditional fields
        if (field.conditional && field.showWhen) {
            const condition = field.showWhen.main_program_id;
            if (Array.isArray(condition)) {
                return condition.includes(Number(mainProgramId));
            } else {
                return Number(mainProgramId) === condition;
            }
        }

        return true;
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTeacherFields.map(field => (
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
                                    options={
                                        field.name === 'entity_category_id' &&
                                        Number(mainProgramId) === 1
                                            ? enhancedOptions?.[field.name]
                                            : generateOptions(
                                                  enhancedOptions?.[field.name]
                                              )
                                    }
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
