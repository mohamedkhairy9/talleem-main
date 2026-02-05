import useRFH from '@/utils/hooks/global/useRFH';
import { studentsSchema as schema } from '@/utils/yup/students.schemas';
import React, { useEffect, useMemo, useState } from 'react';
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
import ModalContent from '@/components/common/form/ModalContent';
import ModalFooter from '@/components/common/form/ModalFooter';
import { isFieldRequired } from '@/utils/helpers/schemaHelpers';
import { useEntitiesQuery } from '@/api/hooks/useEntities';
import { allData } from '@/utils/constants/global.constants';

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

    // Profile picture state
    const [profileImagePreview, setProfileImagePreview] = useState(
        oldData?.profile_picture || null
    );
    const [profileImageChanged, setProfileImageChanged] = useState(false);

    // Update profile image preview when oldData changes (for view/edit mode)
    useEffect(() => {
        const profilePic = oldData?.profile_picture;
        if (profilePic && !profileImageChanged) {
            setProfileImagePreview(profilePic);
        } else if (!profilePic && !profileImageChanged) {
            setProfileImagePreview(null);
        }
    }, [oldData?.profile_picture, profileImageChanged]);

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

    // Get selected branch data to extract city
    const selectedBranch = useMemo(() => {
        if (!branchId || !options?.branch_id) return null;
        return options.branch_id.find(branch => branch.id === branchId);
    }, [branchId, options?.branch_id]);

    // Get city from selected branch
    const branchCity = useMemo(() => {
        return selectedBranch?.city || null;
    }, [selectedBranch]);

    // Create cities array with only the branch's city
    // In edit/view mode, include the city from oldData if it exists
    const filteredCities = useMemo(() => {
        const cities = [];
        
        // Add branch's city if available
        if (branchCity) {
            cities.push({
                id: branchCity.id,
                name: branchCity.name,
                ...branchCity
            });
        }
        
        // In view/edit mode, include selected city from oldData if not already in list
        if ((viewMode || editMode) && oldData?.city_id && options?.city_id) {
            const selectedCity = options.city_id.find(
                c => c.id === oldData.city_id
            );
            if (selectedCity && !cities.some(c => c.id === selectedCity.id)) {
                cities.push(selectedCity);
            }
        }
        
        return cities;
    }, [branchCity, viewMode, editMode, oldData?.city_id, options?.city_id]);

    // Calculate age
    // Calculate age
    const studentAge = useMemo(() => calculateAge(dateOfBirth), [dateOfBirth]);
    const isMinor = studentAge !== null && studentAge < 18;

    // Determine if parent fields should be shown (when student is under 18 years old)
    const shouldShowParentFields = useMemo(() => {
        // Show parent fields only if student is a minor (age < 18)
        return isMinor;
    }, [isMinor]);

    // Fetch entities dynamically based on selected branch and main program
    const { data: entitiesData, isLoading: entitiesLoading } = useEntitiesQuery(
        {
            ...allData,
            branch_id: branchId,
            main_program_id: mainProgramId
        },
        {
            enabled: !!branchId && !!mainProgramId
        }
    );

    // Get entities from the dynamic query (memoized to prevent unnecessary re-renders)
    const entities = useMemo(() => entitiesData?.data || [], [entitiesData?.data]);

    // Get the selected entity's education_program_entity_type
    const selectedEntityEducationType = useMemo(() => {
        if (!entityId || !entities.length) return null;

        const selectedEntity = entities.find(entity => entity.id === Number(entityId));

        if (selectedEntity?.education_program_entity_type) {
            return selectedEntity.education_program_entity_type;
        }

        return null;
    }, [entityId, entities]);

    // Get the selected entity's memorization_program_entity_type
    const selectedEntityMemorizationType = useMemo(() => {
        if (!entityId || !entities.length) return null;

        const selectedEntity = entities.find(entity => entity.id === Number(entityId));

        if (selectedEntity?.memorization_program_entity_type) {
            return selectedEntity.memorization_program_entity_type;
        }

        return null;
    }, [entityId, entities]);

    // Filter branches based on selected city
    // COMMENTED OUT: Branch filtering by city removed - may revert if needed
    // const filteredBranches = useMemo(() => {
    //     if (!city || !options.branch_id) return [];
    //     return options.branch_id.filter(branch => branch.city?.id === Number(city));
    // }, [city, options.branch_id]);

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

    // When entity is selected for memorization program, auto-fill memorization entity type field
    useEffect(() => {
        if (!editMode && !viewMode && selectedEntityMemorizationType && Number(mainProgramId) === 2) {
            // Set memorization_program_entity_type to the entity type name (for display)
            const entityTypeName = selectedEntityMemorizationType.name?.[lang] ||
                selectedEntityMemorizationType.name?.en ||
                selectedEntityMemorizationType.name?.ar;

            if (entityTypeName) {
                setValue('memorization_program_entity_type', entityTypeName, {
                    shouldValidate: true,
                    shouldDirty: true
                });
            }

            // Set memorization_program_entity_type_id (for submission)
            if (selectedEntityMemorizationType.id) {
                setValue('memorization_program_entity_type_id', selectedEntityMemorizationType.id, {
                    shouldValidate: true,
                    shouldDirty: true
                });
            }
        }
    }, [selectedEntityMemorizationType, editMode, viewMode, lang, mainProgramId]);

    // Reset dependent fields when main program changes
    useEffect(() => {
        if (mainProgramId && mainProgramId !== oldData?.main_program_id) {
            setValue('entity_id', '');
            setValue('entity_category_id', '');
            setValue('education_program_entity_type_classification', '');
            setValue('memorization_program_entity_type', '');
            setValue('memorization_program_entity_type_id', '');
        }
    }, [mainProgramId, oldData?.main_program_id]);

    // Initialize city from branch in edit/view mode
    useEffect(() => {
        if ((editMode || viewMode) && oldData?.branch_id && !city && selectedBranch?.city?.id) {
            setValue('city_id', selectedBranch.city.id, { shouldValidate: false });
        }
    }, [editMode, viewMode, oldData?.branch_id, city, selectedBranch, setValue]);

    // Auto-set city_id from selected branch's city when branch changes
    useEffect(() => {
        if (branchId && selectedBranch?.city?.id) {
            const branchCityId = selectedBranch.city.id;
            // Set city_id to branch's city (will override any existing value when branch changes)
            if (city !== branchCityId) {
                setValue('city_id', branchCityId, { shouldValidate: false });
            }
        } else if (!branchId && !viewMode && !editMode) {
            // Reset city when branch is cleared (only in create mode)
            setValue('city_id', '');
        }
    }, [branchId, selectedBranch, city, viewMode, editMode, setValue]);

    // Reset entity when branch changes
    useEffect(() => {
        if (branchId && branchId !== oldData?.branch_id) {
            setValue('entity_id', '');
            setValue('entity_category_id', '');
            setValue('education_program_entity_type_classification', '');
            setValue('memorization_program_entity_type', '');
            setValue('memorization_program_entity_type_id', '');
        }
    }, [branchId, oldData?.branch_id, setValue]);

    // Enhanced options with filtered/dynamic data
    const enhancedOptions = useMemo(() => ({
        ...options,
        entity_id: entities,
        branch_id: options.branch_id, // Using all branches instead of filteredBranches
        city_id: filteredCities // Use branch's city instead of all cities
    }), [options, entities, filteredCities]);

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
            memorization_program_entity_type: _memEntityTypeHelper,
            ...submitData
        } = data;

        // In edit mode, if profile picture not changed, don't send it
        if (editMode && !profileImageChanged) {
            delete submitData.profile_picture;
        }

        // In edit mode, filter out file fields that are links (not File objects)
        // The API only accepts actual File objects, not URLs/links
        if (editMode && submitData.files) {
            // Filter to only include File instances, exclude URL objects
            const fileArray = Array.isArray(submitData.files) 
                ? submitData.files 
                : [submitData.files];
            
            const actualFiles = fileArray.filter(file => file instanceof File);
            
            // If there are actual files, use them; otherwise, remove the field
            if (actualFiles.length > 0) {
                submitData.files = actualFiles;
            } else {
                delete submitData.files;
            }
        }

        const finalData = {
            ...submitData,
            status: submitData.status ? 1 : 0,
        };

        // For education program, set education_program_entity_type_id from entity_category_id
        if (Number(submitData.main_program_id) === 1) {
            finalData.education_program_entity_type_id = submitData.entity_category_id;
        }

        // For memorization program, memorization_program_entity_type_id is already set from the form
        // No additional transformation needed

        mutate(finalData, {
            onSuccess: () => {
                onClose();
            }
        });
    }

    // Helper to check if field is conditionally required
    const isConditionallyRequired = (field) => {
        if (!field.requiredWhen) return isFieldRequired(schema, field.name);
        
        const { main_program_id: requiredMainProgram } = field.requiredWhen;
        if (requiredMainProgram !== undefined) {
            if (Array.isArray(requiredMainProgram)) {
                return requiredMainProgram.includes(Number(mainProgramId));
            }
            return Number(mainProgramId) === requiredMainProgram;
        }
        
        return isFieldRequired(schema, field.name);
    };

    // Filter fields for main section (exclude parent fields)
    const mainFields = studentsFields.filter(field => {
        // Exclude parent section fields
        if (field.section === 'parent') return false;
        
        // Check edit/view mode
        const modeMatch =
            (editMode && field.editMode) ||
            (viewMode && field.viewMode) ||
            (!editMode && !viewMode);

        if (!modeMatch) return false;

        // Check conditional fields
        if (field.conditional && field.showWhen) {
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
        }

        return true;
    });

    // Filter parent fields
    const parentFields = studentsFields.filter(field => {
        if (field.section !== 'parent') return false;
        
        // Check edit/view mode
        const modeMatch =
            (editMode && field.editMode) ||
            (viewMode && field.viewMode) ||
            (!editMode && !viewMode);

        return modeMatch;
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
            <ModalContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mainFields.map(field => {
                        // Hide issue_description if has_medical_issues is not 1
                        if (field.name === 'issue_description' && hasMedicalIssues !== 1) {
                            return null;
                        }

                        // Special handling for classification field (read-only, auto-filled)
                        if (field.name === 'education_program_entity_type_classification') {
                            // This field is required when main_program_id === 1
                            const isRequired = Number(mainProgramId) === 1;
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
                                        required={isRequired}
                                    />
                                </div>
                            );
                        }

                        // Special handling for category field (display educational_entity_classification)
                        if (field.name === 'entity_category_id') {
                            // This field is required when main_program_id === 1
                            const isRequired = Number(mainProgramId) === 1;
                            return (
                                <div key={field.name}>
                                    <label className="block font-medium text-gray-700 mb-1">
                                        {t(field.label)}
                                        {isRequired && <span className="text-red-500 ml-1">*</span>}
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

                        // Special handling for memorization program entity type field (disabled, auto-filled)
                        if (field.name === 'memorization_program_entity_type') {
                            const memorizationEntityTypeValue = watch('memorization_program_entity_type') || '';
                            return (
                                <div key={field.name}>
                                    <label className="block font-medium text-gray-700 mb-1">
                                        {t(field.label)}
                                    </label>
                                    <input
                                        type="text"
                                        value={memorizationEntityTypeValue}
                                        disabled={true}
                                        className="w-full px-3 py-3 border outline-none rounded-lg bg-gray-100 text-gray-700"
                                        placeholder={t(field.placeholder)}
                                    />
                                    {/* Hidden field for the actual value */}
                                    <input type="hidden" {...register('memorization_program_entity_type')} />
                                    <p className="mt-1 h-4 text-xs text-red-600" role="alert">
                                        {t(getNestedError(errors, field.name)) || ''}
                                    </p>
                                </div>
                            );
                        }

                        // Special handling for branch field - disabled until city is selected
                        // COMMENTED OUT: Branch disabled logic based on city removed - branches are no longer filtered by city
                        if (field.name === 'branch_id') {
                            // const isBranchDisabled = !city || viewMode;
                            const isBranchDisabled = viewMode; // Only disabled in view mode

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
                                        required={true}
                                    />
                                </div>
                            );
                        }

                        // Special handling for entity field - disabled until branch is selected
                        if (field.name === 'entity_id') {
                            const isEntityDisabled = !branchId || !mainProgramId || viewMode;

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
                                        required={true}
                                        loading={entitiesLoading}
                                        oldData={oldData}
                                    />
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
                                {field.type === 'file' ? (
                                    field.name === 'profile_picture' ? (
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
                                                required={isConditionallyRequired(field)}
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
                                    ) : (
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
                                            required={isConditionallyRequired(field)}
                                        />
                                    )
                                ) : (
                                    <InputRFH
                                        key={`${field.name}-${enhancedOptions[field.name]?.length || 0}`}
                                        p="px-3 py-3"
                                        control={control}
                                        register={register}
                                        error={getNestedError(errors, field.name)}
                                        type={field.type}
                                        placeholder={field.placeholder}
                                        disabled={viewMode || field.name === 'city_id'}
                                        label={field.label}
                                        name={field.name}
                                        info={field.info}
                                        options={generateOptions(enhancedOptions[field.name] || options[field.name])}
                                        defaultValue={
                                            field.name === 'registration_date' 
                                                ? onlyDate(oldData?.registration_date) || defaultValues[field.name] || field.defaultValue
                                                : defaultValues[field.name] || field.defaultValue
                                        }
                                        min={field.min}
                                        max={field.max}
                                        required={isConditionallyRequired(field)}
                                        oldData={oldData}
                                    />
                                )}
                            </div>
                        );
                    })}
            </div>

            {/* Parent Information Section - Show when shouldShowParentFields */}
            {shouldShowParentFields && parentFields.length > 0 && (
                <div className="mt-6 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                        {t('students.parent_information')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border border-gray-200 rounded-lg">
                        {parentFields.map(field => (
                            <div key={field.name}>
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
                                    info={field.info}
                                    options={generateOptions(options[field.name])}
                                    defaultValue={defaultValues[field.name] || field.defaultValue}
                                    required={isConditionallyRequired(field)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

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

            {/* Validation Errors Summary */}
            {!viewMode && Object.keys(errors).length > 0 && (
                <div className="mx-4 mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="text-red-700 font-semibold mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {t('validation.please_fix_errors')}
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-red-600">
                        {Object.entries(errors).map(([key, value]) => {
                            // Handle nested errors (like qualification.memorized_quran_parts)
                            if (typeof value === 'object' && !value.message) {
                                return Object.entries(value).map(([nestedKey, nestedValue]) => (
                                    <li key={`${key}.${nestedKey}`}>
                                        {t(`validation.${key}.${nestedKey}.label`)}: {nestedValue?.message ? t(nestedValue.message) : t('validation.field_required')}
                                    </li>
                                ));
                            }
                            return (
                                <li key={key}>
                                    {t(`validation.${key}.label`)}: {value?.message ? t(value.message) : t('validation.field_required')}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}

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