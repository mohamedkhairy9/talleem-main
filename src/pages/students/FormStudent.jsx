import useRFH from '@/utils/hooks/global/useRFH';
import { studentsSchema as schema } from '@/utils/yup/students.schemas';
import React, { useEffect, useMemo } from 'react';
import { studentsFields } from './configs';
import InputRFH from '@/components/common/inputs/InputRFH';
import FileInputRFH from '@/components/common/inputs/FileInputRFH';
import Btn from '@/components/common/buttons/Btn';
import { getNestedError } from '@/utils/helpers/getNestedError';
import { generateOptions } from '@/utils/helpers/global.fns';
import { onlyDate } from '@/utils/helpers/global.fns';
import useLocale from '@/utils/hooks/global/useLocale';
import i18next from 'i18next';
import calculateAge from '@/utils/helpers/ageCalculation';

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
            classification: classification, // For display in category field
            name: name, // For display in classification field
            fullObject: educationEntityType
        };
    }
    
    // If it's just a number/ID
    return { id: educationEntityType, classification: null, name: null };
};

export default function FormStudent({
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
    
    // Extract education entity type info
    const educationEntityTypeInfo = useMemo(() => 
        extractEducationEntityTypeData(oldData),
        [oldData]
    );

    // Prepare default values
    const defaultValues = useMemo(() => {
        const baseValues = {
            ...oldData,
            date_of_birth: onlyDate(oldData?.date_of_birth),
            registration_date: onlyDate(oldData?.registration_date),
            qualification: oldData?.qualification || {
                has_high_school: 0,
                high_school_grade: 0,
                has_bachelors_degree: 0,
                major_id: null,
                has_memorized_quran_5_parts: 0,
                memorized_quran_parts: 0
            },
            department: oldData?.department || { en: '', ar: '' },
            parent_name: oldData?.parent_name || { en: '', ar: '' }
        };

        // In edit/view mode, set the classification and category from education_program_entity_type
        if ((editMode || viewMode) && educationEntityTypeInfo.id) {
            baseValues.entity_category_id = educationEntityTypeInfo.id;
            
            // Set classification text (from name)
            if (educationEntityTypeInfo.name) {
                baseValues.education_program_entity_type_classification = 
                    educationEntityTypeInfo.name[lang] || 
                    educationEntityTypeInfo.name.en || 
                    educationEntityTypeInfo.name.ar;
            }
        }

        return baseValues;
    }, [oldData, educationEntityTypeInfo, editMode, viewMode, lang]);

    const { register, errors, handleSubmit, setValue, control, watch } = useRFH({
        schema,
        defaultValues
    });

    // Watch values
    const mainProgramId = watch('main_program_id');
    const hasMedicalIssues = watch('has_medical_issues');
    const hasHighSchool = watch('qualification.has_high_school');
    const hasBachelors = watch('qualification.has_bachelors_degree');
    const hasMemorizedFive = watch('qualification.has_memorized_quran_5_parts');
    const city = watch('city_id');
    const branchId = watch('branch_id');
    const entityId = watch('entity_id');
    const dateOfBirth = watch('date_of_birth');
    
    // Calculate age
    const studentAge = useMemo(() => calculateAge(dateOfBirth), [dateOfBirth]);
    const isMinor = studentAge !== null && studentAge < 18;

    // Get the selected entity's education_program_entity_type
    const selectedEntityEducationType = useMemo(() => {
        if (!entityId || !options.entity_id) return null;
        
        const selectedEntity = options.entity_id.find(entity => entity.id === Number(entityId));
        
        if (selectedEntity?.education_program_entity_type) {
            return selectedEntity.education_program_entity_type;
        }
        
        return null;
    }, [entityId, options.entity_id]);

    // Filter entities based on main program AND branch
    const filteredEntities = useMemo(() => {        
        if (!mainProgramId || !options.entity_id) {
            return [];
        }

        // If no branch selected, return empty array
        if (!branchId) {
            return [];
        }
        
        const entities = options.entity_id;
        
        // Filter by main program AND branch
        const filtered = entities.filter(entity => {
            const matchesProgram = entity.main_program?.id === Number(mainProgramId);
            
            // Check if entity belongs to the selected branch
            // Adjust the property name based on your actual data structure:
            let matchesBranch = false;
            
            if (entity.branch_id) {
                // If entity has direct branch_id
                matchesBranch = entity.branch_id === Number(branchId);
            } else if (entity.branch?.id) {
                // If entity has branch object
                matchesBranch = entity.branch.id === Number(branchId);
            } else if (Array.isArray(entity.branches)) {
                // If entity has multiple branches (many-to-many relationship)
                matchesBranch = entity.branches.some(branch => 
                    branch.id === Number(branchId) || branch === Number(branchId)
                );
            }
                        
            return matchesProgram && matchesBranch;
        });
        
        return filtered;
    }, [mainProgramId, branchId, options.entity_id, lang]);

    // Filter branches based on selected city
    const filteredBranches = useMemo(() => {
        if (!city || !options.branch_id) return [];
        return options.branch_id.filter(branch => branch.city?.id === Number(city));
    }, [city, options.branch_id]);

    // When entity is selected, auto-fill category and classification (CREATE mode only)
    useEffect(() => {
        if (!editMode && !viewMode && selectedEntityEducationType) {            
            // Set entity_category_id to the education_program_entity_type.id
            setValue('entity_category_id', selectedEntityEducationType.id, {
                shouldValidate: true,
                shouldDirty: true
            });
            
            // Set classification to education_program_entity_type.name
            const classificationText = selectedEntityEducationType.name?.[lang] || 
                                      selectedEntityEducationType.name?.en || 
                                      selectedEntityEducationType.name?.ar;
            
            if (classificationText) {
                setValue('education_program_entity_type_classification', classificationText, {
                    shouldValidate: true,
                    shouldDirty: true
                });
            }
        }
    }, [selectedEntityEducationType, editMode, viewMode, lang]);

    // Reset dependent fields when main program changes
    useEffect(() => {
        if (mainProgramId && mainProgramId !== oldData?.main_program_id) {
            setValue('entity_id', '');
            setValue('entity_category_id', '');
            setValue('education_program_entity_type_classification', '');
        }
    }, [mainProgramId, oldData?.main_program_id]);

    // Reset branch and entity when city changes
    useEffect(() => {
        if (city && city !== oldData?.city_id) {
            setValue('branch_id', '');
            setValue('entity_id', '');
            setValue('entity_category_id', '');
            setValue('education_program_entity_type_classification', '');
        }
    }, [city, oldData?.city_id]);

    // Reset entity when branch changes (only if city hasn't changed)
    useEffect(() => {
        if (branchId && branchId !== oldData?.branch_id && city === oldData?.city_id) {
            setValue('entity_id', '');
            setValue('entity_category_id', '');
            setValue('education_program_entity_type_classification', '');
        }
    }, [branchId, city, oldData?.branch_id, oldData?.city_id]);

    // Enhanced options with filtered data
    const enhancedOptions = useMemo(() => ({
        ...options,
        entity_id: filteredEntities,
        branch_id: filteredBranches
    }), [options, filteredEntities, filteredBranches]);

    // Get display value for category (educational_entity_classification)
    const categoryDisplayValue = useMemo(() => {
        if (!selectedEntityEducationType && !educationEntityTypeInfo.classification) return '';
        
        const classification = selectedEntityEducationType?.educational_entity_classification || 
                              educationEntityTypeInfo.classification;
        
        if (!classification) return '';
        
        return classification[lang] || classification.en || classification.ar || '';
    }, [selectedEntityEducationType, educationEntityTypeInfo, lang]);

    function onSubmit(data) {
        const {
            education_program_entity_type_classification: _classificationHelper,
            ...submitData
        } = data;

        const finalData = {
            ...submitData,
            status: submitData.status ? 1 : 0,
        };

        // For education program, set education_program_entity_type_id from entity_category_id
        if (Number(submitData.main_program_id) === 1) {
            finalData.education_program_entity_type_id = submitData.entity_category_id;
        }

        mutate(finalData, {
            onSuccess: () => {
                onClose();
            }
        });
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {studentsFields
                    .filter(field => {
                        // Check edit/view mode
                        const modeMatch =
                            (editMode && field.editMode) ||
                            (viewMode && field.viewMode) ||
                            (!editMode && !viewMode);

                        if (!modeMatch) return false;

                        // Check conditional fields
                        if (field.conditional && field.showWhen) {
                            // Check main_program_id condition
                            const condition = field.showWhen.main_program_id;
                            if (condition !== undefined) {
                                if (Array.isArray(condition)) {
                                    if (!condition.includes(Number(mainProgramId))) {
                                        return false;
                                    }
                                } else if (Number(mainProgramId) !== condition) {
                                    return false;
                                }
                            }

                            // Check age-based condition (for parent fields)
                            if (field.showWhen.isMinor !== undefined) {
                                if (field.showWhen.isMinor !== isMinor) {
                                    return false;
                                }
                            }
                        }

                        return true;
                    })
                    .map(field => {
                        // Hide issue_description if has_medical_issues is not 1
                        if (field.name === 'issue_description' && hasMedicalIssues !== 1) {
                            return null;
                        }

                        // Special handling for classification field (read-only, auto-filled)
                        if (field.name === 'education_program_entity_type_classification') {
                            return (
                                <div key={field.name}>
                                    <InputRFH
                                        p="px-3 py-3"
                                        control={control}
                                        register={register}
                                        error={getNestedError(errors, field.name)}
                                        type="text"
                                        placeholder={field.placeholder}
                                        disabled={true} // Always disabled - auto-filled from entity
                                        label={field.label}
                                        name={field.name}
                                        info={field.info}
                                        defaultValue={defaultValues[field.name] || ''}
                                    />
                                </div>
                            );
                        }

                        // Special handling for category field (display educational_entity_classification)
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
                            const isBranchDisabled = !city || viewMode;
                            
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
                                          (field.type === 'file' && field.name !== 'profile_picture');

                        return (
                            <div
                                key={field.name}
                                className={isFullWidth ? 'md:col-span-2 lg:col-span-3' : ''}
                            >
                                {field.type === 'file' && field.name !== 'profile_picture' ? (
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
                                        setValue={setValue}
                                    />
                                ) : (
                                    <InputRFH
                                        key={`${field.name}-${enhancedOptions[field.name]?.length || 0}`}
                                        p="px-3 py-3"
                                        control={control}
                                        register={register}
                                        error={getNestedError(errors, field.name)}
                                        type={field.type}
                                        placeholder={field.placeholder}
                                        disabled={viewMode}
                                        label={field.label}
                                        name={field.name}
                                        info={field.info}
                                        options={generateOptions(enhancedOptions[field.name] || options[field.name])}
                                        defaultValue={defaultValues[field.name] || field.defaultValue}
                                    />
                                )}
                            </div>
                        );
                    })}
            </div>

            {/* Qualification Section - Only show when main_program_id === 1 */}
            {Number(mainProgramId) === 1 && (
                <div className="mt-6 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                        {t('students.qualification')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border border-gray-200 rounded-lg">
                        <InputRFH
                            p="px-3 py-3"
                            control={control}
                            register={register}
                            error={getNestedError(errors, 'qualification.has_high_school')}
                            type="select"
                            placeholder="validation.qualification.has_high_school.placeholder"
                            disabled={viewMode}
                            label="validation.qualification.has_high_school.label"
                            name="qualification.has_high_school"
                            options={generateOptions(options?.has_high_school)}
                            defaultValue={oldData?.qualification?.has_high_school ?? 0}
                        />
                        {Number(hasHighSchool) === 1 && (
                            <InputRFH
                                p="px-3 py-3"
                                control={control}
                                register={register}
                                error={getNestedError(errors, 'qualification.high_school_grade')}
                                type="number"
                                placeholder="validation.qualification.high_school_grade.placeholder"
                                disabled={viewMode}
                                label="validation.qualification.high_school_grade.label"
                                name="qualification.high_school_grade"
                                defaultValue={oldData?.qualification?.high_school_grade ?? 0}
                            />
                        )}
                        <InputRFH
                            p="px-3 py-3"
                            control={control}
                            register={register}
                            error={getNestedError(errors, 'qualification.has_bachelors_degree')}
                            type="select"
                            placeholder="validation.qualification.has_bachelors_degree.placeholder"
                            disabled={viewMode}
                            label="validation.qualification.has_bachelors_degree.label"
                            name="qualification.has_bachelors_degree"
                            options={generateOptions(options?.has_bachelors_degree)}
                            defaultValue={oldData?.qualification?.has_bachelors_degree ?? 0}
                        />
                        {Number(hasBachelors) === 1 && (
                            <InputRFH
                                p="px-3 py-3"
                                control={control}
                                register={register}
                                error={getNestedError(errors, 'qualification.major_id')}
                                type="select"
                                placeholder="validation.major_id.placeholder"
                                disabled={viewMode}
                                label="validation.major_id.label"
                                name="qualification.major_id"
                                options={generateOptions(options?.major_id)}
                                defaultValue={oldData?.qualification?.major_id || ''}
                            />
                        )}
                        <InputRFH
                            p="px-3 py-3"
                            control={control}
                            register={register}
                            error={getNestedError(errors, 'qualification.has_memorized_quran_5_parts')}
                            type="select"
                            placeholder="validation.qualification.has_memorized_quran_5_parts.placeholder"
                            disabled={viewMode}
                            label="validation.qualification.has_memorized_quran_5_parts.label"
                            name="qualification.has_memorized_quran_5_parts"
                            options={generateOptions(options?.has_memorized_quran_5_parts)}
                            defaultValue={oldData?.qualification?.has_memorized_quran_5_parts ?? 0}
                        />
                        {Number(hasMemorizedFive) === 0 && (
                            <InputRFH
                                p="px-3 py-3"
                                control={control}
                                register={register}
                                error={getNestedError(errors, 'qualification.memorized_quran_parts')}
                                type="number"
                                placeholder="validation.qualification.memorized_quran_parts.placeholder"
                                disabled={viewMode}
                                label="validation.qualification.memorized_quran_parts.label"
                                name="qualification.memorized_quran_parts"
                                defaultValue={oldData?.qualification?.memorized_quran_parts ?? 0}
                            />
                        )}
                    </div>
                </div>
            )}

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