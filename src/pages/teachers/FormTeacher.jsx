import useRFH from '@/utils/hooks/global/useRFH';
import { teachersSchema as schema } from '@/utils/yup/teachers.schemas';
import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import { useEntityQuery } from '@/api/hooks/useEntities';

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
    const [profileImagePreview, setProfileImagePreview] = useState(
        oldData?.profile_image || oldData?.profile_picture || null
    );
    const [profileImageChanged, setProfileImageChanged] = useState(false);

    const cityId = watch('city_id');
    const branchId = watch('branch_id');
    const mainProgramId = watch('main_program_id');
    const entityId = watch('entity_id');
    const educationClassification = watch(
        'education_program_entity_type_classification'
    );

    // Track if entity has been fetched and populated
    const [entityFieldsPopulated, setEntityFieldsPopulated] = useState(false);

    // Get unique options by name for education program entity types (for mainProgramId === 1)
    // MOVED THIS BEFORE THE useEffect THAT USES IT
    const uniqueEducationClassifications = useMemo(
        () =>
            getUniqueOptionsByName(
                options.education_program_entity_type_id || []
            ),
        [options.education_program_entity_type_id, i18next.language]
    );

    // Fetch entity details when entity_id changes
    const { data: entityData, isLoading: entityLoading } = useEntityQuery(
        entityId,
        {
            enabled: !!entityId && !editMode // Only fetch when entityId exists and not in edit mode
        }
    );

// Auto-populate fields when entity data is fetched
useEffect(() => {
    if (entityData?.data && entityId && !editMode) {
        const entity = entityData.data;
        
        console.log('Entity Data:', entity);
        
        // Handle education program (main_program_id === 1)
        if (Number(mainProgramId) === 1 && entity.education_program_entity_type) {
            const educationType = entity.education_program_entity_type;
            
            console.log('Education Type:', educationType);
            
            // Get the classification text based on current language
            const lang = i18next.language;
            const classificationText = educationType.educational_entity_classification?.[lang] || 
                                      educationType.educational_entity_classification?.en ||
                                      educationType.educational_entity_classification?.ar;
            
            const nameText = educationType.name?.[lang] || 
                           educationType.name?.en ||
                           educationType.name?.ar;
            
            console.log('Setting values:', {
                classification: classificationText,
                name: nameText,
                id: educationType.id
            });
            
            // Set classification (category - e.g., "Teacher training institutes")
            setValue(
                'education_program_entity_type_classification',
                classificationText,
                { shouldValidate: false, shouldDirty: true }
            );
            
            // Set entity_category_id (name - e.g., "Sharia institutes")
            // Store the ID in a hidden field for submission
            setValue('entity_category_id', nameText, {
                shouldValidate: false,
                shouldDirty: true
            });
            
            // Store the actual ID in a hidden field
            setValue('entity_category_id_value', String(educationType.id), {
                shouldValidate: false,
                shouldDirty: true
            });
            
            setEntityFieldsPopulated(true);
        }
        
        // Handle memorization program (main_program_id === 2)
        if (Number(mainProgramId) === 2 && entity.memorization_program_entity_type) {
            const lang = i18next.language;
            const nameText = entity.memorization_program_entity_type.name?.[lang] || 
                           entity.memorization_program_entity_type.name?.en ||
                           entity.memorization_program_entity_type.name?.ar;
            
            console.log('Memorization Type:', entity.memorization_program_entity_type);
            
            setValue('entity_category_id', nameText, {
                shouldValidate: false,
                shouldDirty: true
            });
            
            // Store the actual ID in a hidden field
            setValue('entity_category_id_value', String(entity.memorization_program_entity_type.id), {
                shouldValidate: false,
                shouldDirty: true
            });
            
            setEntityFieldsPopulated(true);
        }
    }
}, [entityData, entityId, editMode, mainProgramId, setValue, i18next.language]);


// Reset populated flag when entity changes
    useEffect(() => {
        if (!editMode && entityId) {
            setEntityFieldsPopulated(false);
        }
    }, [entityId, editMode]);

    // Filter entity categories based on selected classification (for mainProgramId === 1)
    const filteredEntityCategories = useMemo(() => {
        if (Number(mainProgramId) !== 1 || !educationClassification) return [];
        const lang = i18next.language;
        const selectedClassification = uniqueEducationClassifications.find(
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
        return (options.education_program_entity_type_id || []).filter(opt => {
            const optName =
                opt.name?.[lang] || opt.name?.en || opt.name?.ar || opt.name;
            return optName === selectedName;
        });
    }, [
        mainProgramId,
        educationClassification,
        uniqueEducationClassifications,
        options.education_program_entity_type_id,
        i18next.language
    ]);

    useEffect(() => {
        if ((cityId && cityId != oldData?.city_id) || !oldData?.city_id) {
            setValue('branch_id', '');
            setValue('entity_id', '');
            setValue('education_program_entity_type_classification', '');
            setValue('entity_category_id', '');
            setEntityFieldsPopulated(false);
        }
    }, [cityId, oldData?.city_id, setValue]);

    useEffect(() => {
        if (
            (branchId && branchId != oldData?.branch_id) ||
            !oldData?.branch_id
        ) {
            setValue('entity_id', '');
            setValue('education_program_entity_type_classification', '');
            setValue('entity_category_id', '');
            setEntityFieldsPopulated(false);
        }
    }, [branchId, oldData?.branch_id, setValue]);

    useEffect(() => {
        if (
            (mainProgramId && mainProgramId != oldData?.main_program_id) ||
            !oldData?.main_program_id
        ) {
            setValue('education_program_entity_type_classification', '');
            setValue('entity_category_id', '');
            setEntityFieldsPopulated(false);
        }
    }, [mainProgramId, oldData?.main_program_id, setValue]);

    const initializingClassificationRef = useRef(false);
    useEffect(() => {
        if (Number(mainProgramId) === 1) {
            const isInitializing = initializingClassificationRef.current;
            if (
                (educationClassification &&
                    educationClassification !=
                        oldData?.education_program_entity_type_classification) ||
                (!oldData?.education_program_entity_type_classification &&
                    !isInitializing &&
                    !entityFieldsPopulated) // Don't clear if entity is being populated
            ) {
                // Only clear if not being auto-populated
                if (!entityLoading) {
                    setValue('entity_category_id', '');
                }
            }
        }
    }, [
        educationClassification,
        mainProgramId,
        oldData?.education_program_entity_type_classification,
        setValue,
        entityFieldsPopulated,
        entityLoading
    ]);

    const initializedClassificationRef = useRef(false);
    useEffect(() => {
        if (initializedClassificationRef.current) return;
        if (
            Number(mainProgramId) === 1 &&
            oldData?.entity_category_id &&
            !oldData?.education_program_entity_type_classification
        ) {
            const selectedEntityType = (
                options.education_program_entity_type_id || []
            ).find(opt => opt.id === oldData.entity_category_id);
            if (!selectedEntityType) return;
            const lang = i18next.language;
            const selectedName =
                selectedEntityType.name?.[lang] ||
                selectedEntityType.name?.en ||
                selectedEntityType.name?.ar ||
                selectedEntityType.name;
            const matchingUniqueClassification =
                uniqueEducationClassifications.find(u => {
                    const uName =
                        u.name?.[lang] || u.name?.en || u.name?.ar || u.name;
                    return uName === selectedName;
                });
            if (matchingUniqueClassification) {
                setValue(
                    'education_program_entity_type_classification',
                    matchingUniqueClassification.id ||
                        matchingUniqueClassification.value,
                    { shouldDirty: false, shouldValidate: false }
                );
                initializedClassificationRef.current = true;
                initializingClassificationRef.current = true;
            }
        }
    }, [
        mainProgramId,
        oldData,
        uniqueEducationClassifications,
        options.education_program_entity_type_id,
        setValue
    ]);

    // After classification has been initialized in edit mode, set entity_category_id from oldData
    useEffect(() => {
        if (
            Number(mainProgramId) === 1 &&
            initializedClassificationRef.current &&
            oldData?.entity_category_id
        ) {
            setValue('entity_category_id', oldData.entity_category_id, {
                shouldDirty: false,
                shouldValidate: false
            });
            // Done with initialization guard
            initializingClassificationRef.current = false;
        }
    }, [mainProgramId, setValue, oldData?.entity_category_id]);

    const enhancedOptions = {
        ...options,
        branch_id:
            cityId
                ? options.branch_id?.filter(
                      branch => branch.city?.id === Number(cityId)
                  ) || []
                : options.branch_id || [],
        entity_id:
            branchId
                ? options.entity_id?.filter(
                      entity => entity.branch?.id === Number(branchId)
                  ) || []
                : [],
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
        const {
            education_program_entity_type_classification: _helper,
            ...rest
        } = data;
        const payload = {
            ...rest,
            ...(Number(rest.main_program_id) === 1
                ? { education_program_entity_type_id: rest.entity_category_id }
                : Number(rest.main_program_id) === 2
                ? {
                      memorization_program_entity_type_id:
                          rest.entity_category_id
                  }
                : {})
        };

        // In edit mode, if profile image not changed, don't send it
        if (editMode && !profileImageChanged) {
            delete payload.profile_image;
            delete payload.profile_picture;
        }

        mutate(payload, {
            onSuccess: () => {
                onClose();
            }
        });
    }

    // Helper function to determine if a field should be disabled
    const isFieldDisabled = (fieldName) => {
        if (viewMode) return true;

        // In edit mode, fields are always enabled
        if (editMode) return false;

        // Entity field disabled until branch is selected
        if (fieldName === 'entity_id' && !branchId) {
            return true;
        }

        // Classification field disabled until entity is selected (but enabled after entity is fetched)
        if (fieldName === 'education_program_entity_type_classification') {
            return !entityId || entityLoading;
        }

        // Category field disabled until classification is selected OR until entity data is loaded
        if (fieldName === 'entity_category_id') {
            if (Number(mainProgramId) === 1) {
                return !educationClassification || entityLoading;
            }
            if (Number(mainProgramId) === 2) {
                return !entityId || entityLoading;
            }
        }

        return false;
    };

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
                        field.name === 'profile_image' ? (
                            <div className="space-y-2">
                                <InputRFH
                                    info={field.info}
                                    p="px-3 py-3"
                                    control={control}
                                    register={register}
                                    error={getNestedError(errors, field.name)}
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    disabled={isFieldDisabled(field.name)}
                                    label={field.label}
                                    name={field.name}
                                    accept={field.accept}
                                    onChange={e => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setProfileImageChanged(true);
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                setProfileImagePreview(
                                                    reader.result
                                                );
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                    defaultValue={oldData?.[field.name]}
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
                        ) : field.type === 'file' ? (
                            <FileInputRFH
                                register={register}
                                control={control}
                                error={getNestedError(errors, field.name)}
                                placeholder={field.placeholder}
                                disabled={isFieldDisabled(field.name)}
                                label={field.label}
                                name={field.name}
                                multiple={field.multiple}
                                defaultValue={oldData?.[field.name] || []}
                                setValue={setValue}
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
                                disabled={isFieldDisabled(field.name)}
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
                                    oldData?.[field.name] || field.defaultValue
                                }
                            />
                        )}
                    </div>
                ))}
            </div>
            {!viewMode && (
                <Btn
                    loading={isPending || entityLoading}
                    className="py-[10px] w-full"
                    type="submit"
                    label="common.submit"
                />
            )}
        </form>
    );
}