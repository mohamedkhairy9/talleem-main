import useRFH from '@/utils/hooks/global/useRFH';
import { teachersSchema as schema } from '@/utils/yup/teachers.schemas';
import React, { useEffect, useMemo, useState } from 'react';
import { teachersFields } from './configs';
import InputRFH from '@/components/common/inputs/InputRFH';
import FileInputRFH from '@/components/common/inputs/FileInputRFH';
import Btn from '@/components/common/buttons/Btn';
import { getNestedError } from '@/utils/helpers/getNestedError';
import { generateOptions } from '@/utils/helpers/global.fns';
import { onlyDate } from '@/utils/helpers/global.fns';
import useLocale from '@/utils/hooks/global/useLocale';
import i18next from 'i18next';

// Helper to extract education entity type data from oldData
const extractEducationEntityTypeData = (oldData) => {
    if (!oldData?.education_program_entity_type_id) {
        return { id: null, classification: null, name: null };
    }

    const educationEntityType = oldData.education_program_entity_type_id;
    
    // Check if it's an object (nested data from backend)
    if (typeof educationEntityType === 'object' && educationEntityType !== null) {
        const classification = educationEntityType.educational_entity_classification;
        const name = educationEntityType.name;
        
        return {
            id: educationEntityType.id,
            classification: classification,
            name: name,
            fullObject: educationEntityType
        };
    }
    
    return { id: educationEntityType, classification: null, name: null };
};

// Helper to extract memorization entity type data from oldData
const extractMemorizationEntityTypeData = (oldData) => {
    if (!oldData?.memorization_program_entity_type_id) {
        return { id: null, name: null };
    }

    const memorizationEntityType = oldData.memorization_program_entity_type_id;
    
    if (typeof memorizationEntityType === 'object' && memorizationEntityType !== null) {
        return {
            id: memorizationEntityType.id,
            name: memorizationEntityType.name,
            fullObject: memorizationEntityType
        };
    }
    
    return { id: memorizationEntityType, name: null };
};

export default function FormTeacher({
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
        oldData?.profile_image || oldData?.profile_picture || null
    );
    const [profileImageChanged, setProfileImageChanged] = useState(false);

    // Extract entity type info
    const educationEntityTypeInfo = useMemo(() => 
        extractEducationEntityTypeData(oldData),
        [oldData]
    );

    const memorizationEntityTypeInfo = useMemo(() => 
        extractMemorizationEntityTypeData(oldData),
        [oldData]
    );

    // Prepare default values
    const defaultValues = useMemo(() => {
        const baseValues = {
            ...oldData,
            dob: onlyDate(oldData?.dob)
        };

        // In edit/view mode, set the classification and category
        if (editMode || viewMode) {
            if (Number(oldData?.main_program_id) === 1 && educationEntityTypeInfo.id) {
                baseValues.entity_category_id = educationEntityTypeInfo.id;
                
                if (educationEntityTypeInfo.name) {
                    baseValues.education_program_entity_type_classification = 
                        educationEntityTypeInfo.name[lang] || 
                        educationEntityTypeInfo.name.en || 
                        educationEntityTypeInfo.name.ar;
                }
            } else if (Number(oldData?.main_program_id) === 2 && memorizationEntityTypeInfo.id) {
                baseValues.entity_category_id = memorizationEntityTypeInfo.id;
            }
        }

        return baseValues;
    }, [oldData, educationEntityTypeInfo, memorizationEntityTypeInfo, editMode, viewMode, lang]);

    const { register, errors, handleSubmit, control, setValue, watch } = useRFH({
        schema,
        defaultValues
    });

    // Watch values
    const cityId = watch('city_id');
    const branchId = watch('branch_id');
    const mainProgramId = watch('main_program_id');
    const entityId = watch('entity_id');
    const educationClassification = watch('education_program_entity_type_classification');
    const entityCategory = watch('entity_category_id');

    // Get the selected entity's education_program_entity_type
    const selectedEntityEducationType = useMemo(() => {
        if (!entityId || !options.entity_id) return null;
        
        const selectedEntity = options.entity_id.find(entity => entity.id === Number(entityId));
        
        if (Number(mainProgramId) === 1 && selectedEntity?.education_program_entity_type) {
            return selectedEntity.education_program_entity_type;
        }
        
        if (Number(mainProgramId) === 2 && selectedEntity?.memorization_program_entity_type) {
            return selectedEntity.memorization_program_entity_type;
        }
        
        return null;
    }, [entityId, mainProgramId, options.entity_id]);

    // Filter entities based on main program AND branch
    const filteredEntities = useMemo(() => {
        console.log('=== FILTERING ENTITIES (TEACHERS) ===');
        console.log('mainProgramId:', mainProgramId);
        console.log('branchId:', branchId);
        
        if (!mainProgramId || !options.entity_id) {
            console.log('No program selected');
            return [];
        }

        if (!branchId) {
            console.log('No branch selected - entities disabled');
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
            
            console.log(`Entity ${entity.id} (${entity.name?.[lang]}):`, {
                matchesProgram,
                matchesBranch,
                included: matchesProgram && matchesBranch
            });
            
            return matchesProgram && matchesBranch;
        });
        
        console.log('Final filtered entities:', filtered.length);
        return filtered;
    }, [mainProgramId, branchId, options.entity_id, lang]);

    // Filter branches based on selected city
    const filteredBranches = useMemo(() => {
        if (!cityId || !options.branch_id) return [];
        return options.branch_id.filter(branch => branch.city?.id === Number(cityId));
    }, [cityId, options.branch_id]);

    // When entity is selected, auto-fill category and classification (CREATE mode only)
    useEffect(() => {
        if (!editMode && !viewMode && selectedEntityEducationType) {
            console.log('Selected entity education type:', selectedEntityEducationType);
            
            if (Number(mainProgramId) === 1) {
                // Education program
                setValue('entity_category_id', selectedEntityEducationType.id, {
                    shouldValidate: true,
                    shouldDirty: true
                });
                
                const classificationText = selectedEntityEducationType.name?.[lang] || 
                                          selectedEntityEducationType.name?.en || 
                                          selectedEntityEducationType.name?.ar;
                
                if (classificationText) {
                    setValue('education_program_entity_type_classification', classificationText, {
                        shouldValidate: true,
                        shouldDirty: true
                    });
                }
            } else if (Number(mainProgramId) === 2) {
                // Memorization program
                setValue('entity_category_id', selectedEntityEducationType.id, {
                    shouldValidate: true,
                    shouldDirty: true
                });
            }
        }
    }, [selectedEntityEducationType, setValue, editMode, viewMode, lang, mainProgramId]);

    // Reset dependent fields when main program changes
    useEffect(() => {
        if (mainProgramId && mainProgramId !== oldData?.main_program_id) {
            console.log('Main program changed, resetting fields');
            setValue('entity_id', '');
            setValue('entity_category_id', '');
            setValue('education_program_entity_type_classification', '');
        }
    }, [mainProgramId, oldData?.main_program_id, setValue]);

    // Reset branch and entity when city changes
    useEffect(() => {
        if (cityId && cityId !== oldData?.city_id) {
            console.log('City changed, resetting branch and entity');
            setValue('branch_id', '');
            setValue('entity_id', '');
            setValue('entity_category_id', '');
            setValue('education_program_entity_type_classification', '');
        }
    }, [cityId, oldData?.city_id, setValue]);

    // Reset entity when branch changes (only if city hasn't changed)
    useEffect(() => {
        if (branchId && branchId !== oldData?.branch_id && cityId === oldData?.city_id) {
            console.log('Branch changed, resetting entity');
            setValue('entity_id', '');
            setValue('entity_category_id', '');
            setValue('education_program_entity_type_classification', '');
        }
    }, [branchId, cityId, oldData?.branch_id, oldData?.city_id, setValue]);

    // Enhanced options with filtered data
    const enhancedOptions = useMemo(() => ({
        ...options,
        entity_id: filteredEntities,
        branch_id: filteredBranches
    }), [options, filteredEntities, filteredBranches]);

    // Get display value for category
    const categoryDisplayValue = useMemo(() => {
        if (Number(mainProgramId) === 1) {
            // For education program, show educational_entity_classification
            const classification = selectedEntityEducationType?.educational_entity_classification || 
                                  educationEntityTypeInfo.classification;
            
            if (!classification) return '';
            
            return classification[lang] || classification.en || classification.ar || '';
        } else if (Number(mainProgramId) === 2) {
            // For memorization program, show the entity type name
            const name = selectedEntityEducationType?.name || memorizationEntityTypeInfo.name;
            
            if (!name) return '';
            
            return name[lang] || name.en || name.ar || '';
        }
        
        return '';
    }, [selectedEntityEducationType, educationEntityTypeInfo, memorizationEntityTypeInfo, mainProgramId, lang]);

    // Get display value for classification (for education program only)
    const classificationDisplayValue = useMemo(() => {
        if (Number(mainProgramId) !== 1) return '';
        
        const name = selectedEntityEducationType?.name || educationEntityTypeInfo.name;
        
        if (!name) return '';
        
        return name[lang] || name.en || name.ar || '';
    }, [selectedEntityEducationType, educationEntityTypeInfo, mainProgramId, lang]);

    function onSubmit(data) {
        const {
            education_program_entity_type_classification: _classificationHelper,
            ...submitData
        } = data;

        const finalData = {
            ...submitData,
            // Don't convert status - send as is ('active', 'canceled', 'unauthorized')
        };

        // For education program, set education_program_entity_type_id
        if (Number(submitData.main_program_id) === 1) {
            finalData.education_program_entity_type_id = submitData.entity_category_id;
        }
        
        // For memorization program, set memorization_program_entity_type_id
        if (Number(submitData.main_program_id) === 2) {
            finalData.memorization_program_entity_type_id = submitData.entity_category_id;
        }

        // In edit mode, if profile image not changed, don't send it
        if (editMode && !profileImageChanged) {
            delete finalData.profile_image;
            delete finalData.profile_picture;
        }

        console.log('Submitting teacher data:', finalData);

        mutate(finalData, {
            onSuccess: () => {
                onClose();
            }
        });
    }

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
                {filteredTeacherFields.map(field => {
                    // Special handling for classification field (read-only, auto-filled)
                    if (field.name === 'education_program_entity_type_classification') {
                        return (
                            <div key={field.name}>
                                <label className="block font-medium text-gray-700 mb-1">
                                    {t(field.label)}
                                </label>
                                <input
                                    type="text"
                                    value={classificationDisplayValue}
                                    disabled={true}
                                    className="w-full px-3 py-3 border outline-none rounded-lg bg-gray-100 text-gray-700"
                                    placeholder={t(field.placeholder)}
                                />
                                {/* Hidden field for the actual value */}
                                <input type="hidden" {...register('education_program_entity_type_classification')} />
                                <p className="mt-1 h-4 text-xs text-red-600" role="alert">
                                    {t(getNestedError(errors, field.name)) || ''}
                                </p>
                            </div>
                        );
                    }

                    // Special handling for category field (display classification or name)
                    if (field.name === 'entity_category_id') {
                        return (
                            <div key={field.name}>
                                <label className="block font-medium text-gray-700 mb-1">
                                    {t(field.label)}
                                </label>
                                <input
                                    type="text"
                                    value={categoryDisplayValue}
                                    disabled={true}
                                    className="w-full px-3 py-3 border outline-none rounded-lg bg-gray-100 text-gray-700"
                                    placeholder={t(field.placeholder)}
                                />
                                {/* Hidden field for the actual ID value */}
                                <input type="hidden" {...register('entity_category_id')} />
                                <p className="mt-1 h-4 text-xs text-red-600" role="alert">
                                    {t(getNestedError(errors, field.name)) || ''}
                                </p>
                            </div>
                        );
                    }

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
                                    options={generateOptions(enhancedOptions[field.name] || [])}
                                    defaultValue={defaultValues[field.name] || field.defaultValue}
                                />
                                {!cityId && !viewMode && (
                                    <p className="mt-1 text-xs text-gray-500">
                                        {t('validation.select_city_first')}
                                    </p>
                                )}
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
                                    options={generateOptions(enhancedOptions[field.name] || [])}
                                    defaultValue={defaultValues[field.name] || field.defaultValue}
                                />
                                {!branchId && !viewMode && (
                                    <p className="mt-1 text-xs text-gray-500">
                                        {t('validation.select_branch_first')}
                                    </p>
                                )}
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
                            {field.type === 'file' && field.name === 'profile_image' ? (
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
                                                    setProfileImagePreview(reader.result);
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
                                    key={`${field.name}-${enhancedOptions[field.name]?.length || 0}`}
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
                                    options={generateOptions(enhancedOptions[field.name] || options[field.name])}
                                    defaultValue={defaultValues[field.name] || field.defaultValue}
                                />
                            )}
                        </div>
                    );
                })}
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