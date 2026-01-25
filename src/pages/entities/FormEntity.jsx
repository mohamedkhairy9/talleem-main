import useRFH from '@/utils/hooks/global/useRFH';
import { entitiesSchema as schema } from '@/utils/yup/entities.schemas';
import React, { useEffect, useMemo, useState } from 'react';
import { entitiesFields, managerFields } from './configs';
import InputRFH from '@/components/common/inputs/InputRFH';
import FileInputRFH from '@/components/common/inputs/FileInputRFH';
import Btn from '@/components/common/buttons/Btn';
import { getNestedError } from '@/utils/helpers/getNestedError';
import {
    generateOptions,
    getUniqueOptionsByName,
    generateOptionsWithCustomLabel
} from '@/utils/helpers/global.fns';
import useLocale from '@/utils/hooks/global/useLocale';
import MapPicker from '@/components/common/maps/MapPicker';
import Accordion from '@/components/common/UIs/Accordion';
import i18next from 'i18next';
import * as yup from 'yup';
import ModalContent from '@/components/common/form/ModalContent';
import ModalFooter from '@/components/common/form/ModalFooter';
import { activitiesService } from '@/api/services/activities.service';
import { allData } from '@/utils/constants/global.constants';
import { useQuery } from '@tanstack/react-query';
import { API_KEYS } from '@/api/endpoints';
import { isFieldRequired } from '@/utils/helpers/schemaHelpers';

export default function FormEntity({
    onClose,
    oldData,
    editMode,
    viewMode,
    isPending,
    mutate,
    options
}) {
    const { t } = useLocale();
    const [openSections, setOpenSections] = useState({
        entityInfo: true,
        managerInfo: false
    });
    const [profileImagePreview, setProfileImagePreview] = useState(
        oldData?.manager?.profile_image || null
    );
    const [profileImageChanged, setProfileImageChanged] = useState(false);
    const [licenseImagePreview, setLicenseImagePreview] = useState(
        oldData?.license_image || null
    );
    const [licenseImageChanged, setLicenseImageChanged] = useState(false);

    const [adjustedSchema, setAdjustedSchema] = useState(schema);
    const { register, errors, handleSubmit, control, setValue, watch } = useRFH(
        {
            schema: adjustedSchema,
            defaultValues: oldData
        }
    );


    useEffect(() => {
        if(openSections.managerInfo){
            setAdjustedSchema(schema);
        }else{
            // exclude the manager field when manger section isn't open
            const { manager, ...filteredFields } = schema.fields;
            const newSchema = yup.object(filteredFields);
            setAdjustedSchema(newSchema);
        }
    }, [openSections.managerInfo])

    // Update license image preview when oldData changes (for view/edit mode)
    useEffect(() => {
        if (!licenseImageChanged) {
            const licenseImg = oldData?.license_image;
            if (licenseImg && typeof licenseImg === 'string' && licenseImg.trim() !== '') {
                setLicenseImagePreview(licenseImg);
            } else {
                setLicenseImagePreview(null);
            }
        }
    }, [oldData?.license_image, licenseImageChanged])

    console.log('errors', errors);

    function onSubmit(data) {
        // Remove profile_image if not changed in edit mode
        if (editMode && data.manager && !profileImageChanged) {
            delete data.manager.profile_image;
        }

        // Remove the helper field from submission
        const {
            education_program_entity_type_classification: _classificationHelper,
            ...submitData
        } = data;

        // Remove license_image if not changed in edit mode
        if (editMode && !licenseImageChanged) {
            delete submitData.license_image;
        }

        mutate(
            {
                ...submitData,
                manager: {
                    ...submitData.manager,
                    status: submitData.manager.status ? 1 : 0
                },
                status: submitData.status,
                ...(submitData.main_program_id == 1
                    ? {
                          education_program_entity_type_id:
                              submitData.entity_category_id
                      }
                    : submitData.main_program_id == 2
                    ? {
                          memorization_program_entity_type_id:
                              submitData.entity_category_id
                      }
                    : {})
            },
            {
                onSuccess: () => {
                    onClose();
                }
            }
        );
    }

    const cityId = watch('city_id');
    const mainProgramId = watch('main_program_id');
    const entryType = watch('entry_type');
    const educationClassification = watch(
        'education_program_entity_type_classification'
    );

    const [prevEducationClassification, setPrevEducationClassification] = useState(null);

    console.log("change:", educationClassification)

    console.log('mainProgramId', mainProgramId);

    // Fetch activities dynamically based on selected mainProgramId
    const { data: dynamicActivitiesData } = useQuery({
        queryKey: [API_KEYS.ACTIVITIES, { ...allData, main_program_id: mainProgramId }],
        queryFn: () => activitiesService.getActivities({ ...allData, main_program_id: mainProgramId }),
        enabled: !!mainProgramId
    });

    // Get unique options by name for education program entity types (for mainProgramId === 1)
    const uniqueEducationClassifications = useMemo(() => getUniqueOptionsByName(
        options.education_program_entity_type_id || []
    ), [options.education_program_entity_type_id]);

    // Filter entity categories based on selected classification (for mainProgramId === 1)
    const filteredEntityCategories =
        mainProgramId === 1 && educationClassification
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

    const enhancedOptions = {
        ...options,
        neighborhood_id:
            options.neighborhood_id?.filter(
                neighborhood => neighborhood.city?.id === cityId
            ) || [],
        branch_id:
            options.branch_id?.filter(branch => branch.city?.id === cityId) ||
            [],
        education_program_entity_type_classification:
            uniqueEducationClassifications,
        entity_category_id:
            mainProgramId === 1
                ? generateOptionsWithCustomLabel(
                      filteredEntityCategories,
                      'educational_entity_classification'
                  )
                : mainProgramId === 2
                ? options.memorization_program_entity_type_id || []
                : [],
        // Only use dynamic activities data when mainProgramId is selected
        // Otherwise use empty array (field will be disabled)
        activity_ids: mainProgramId ? (dynamicActivitiesData?.data || []) : []
    };

    useEffect(() => {
        if (
            (mainProgramId && mainProgramId != oldData?.main_program_id) ||
            !oldData?.main_program_id
        ) {
            setValue('education_program_entity_type_classification', '');
            setValue('entity_category_id', '');
            setValue('activity_ids', []); // Reset activities when program changes
        }
    }, [mainProgramId, oldData?.main_program_id, setValue]);

    // useEffect(() => {
    //     if (mainProgramId === 1) {
    //         if(educationClassification !== prevEducationClassification && prevEducationClassification !== null){
    //             setValue('entity_category_id', '');
    //         } 
    //         setPrevEducationClassification(educationClassification);
    //         // if (
    //         //     (educationClassification &&
    //         //         educationClassification !=
    //         //             oldData?.education_program_entity_type_classification) ||
    //         //     !oldData?.education_program_entity_type_classification
    //         // ) {
    //         //     setValue('entity_category_id', '');
    //         // }
    //     }
    // }, [
    //     educationClassification,
    //     mainProgramId,
    //     oldData?.education_program_entity_type_classification,
    //     setValue
    // ]);

    // Set the classification value when editing (based on entity_category_id's name)
    useEffect(() => {
        if (
            mainProgramId === 1 &&
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

    // Auto-set status based on entry_type
    useEffect(() => {
        if (entryType && !viewMode) {
            if (entryType === 'active_with_license') {
                setValue('status', 'active', { shouldValidate: false });
            } else if (entryType === 'new_with_approval') {
                setValue('status', 'inactive', { shouldValidate: false });
            }
        }
    }, [entryType, viewMode, setValue]);

    useEffect(() => {
        if ((cityId && cityId != oldData?.city_id) || !oldData?.city_id) {
            setValue('branch_id', '');
            setValue('neighborhood_id', '');
        }
    }, [cityId, oldData?.city_id, setValue]);

    // Manager-specific options mapping
    const managerOptions = {
        'manager.nationality_id':
            options['manager.nationality_id'] || options.nationality_id,
        'manager.city_id': options['manager.city_id'] || options.city_id,
        'manager.academic_level_id':
            options['manager.academic_level_id'] || options.academic_level_id,
        'manager.specification_id':
            options['manager.specification_id'] || options.specification_id,
        'manager.gender': options['manager.gender'] || options.gender
    };

    const toggleSection = section => {
        setOpenSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const renderField = (field, fieldOptions = null) => {
        const fieldName = field.name;
        const isNested = fieldName.includes('.');
        const defaultValue = isNested
            ? fieldName.split('.').reduce((obj, key) => obj?.[key], oldData)
            : oldData?.[fieldName] || field.defaultValue;

        const error = getNestedError(errors, fieldName);

        if (field.type === 'file') {
            if (field.name === 'manager.profile_image') {
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
                            required={isFieldRequired(adjustedSchema, fieldName)}
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
            if (field.name === 'license_image') {
                const isImage = licenseImagePreview && 
                    (typeof licenseImagePreview === 'string' && 
                     (licenseImagePreview.startsWith('data:image') || 
                      licenseImagePreview.match(/\.(jpg|jpeg|png|gif)$/i)));
                const isPdf = licenseImagePreview && 
                    typeof licenseImagePreview === 'string' && 
                    (licenseImagePreview.includes('.pdf') || licenseImagePreview.startsWith('data:application/pdf'));
                
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
                            required={isFieldRequired(adjustedSchema, fieldName)}
                            onChange={e => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    setLicenseImageChanged(true);
                                    if (file.type.startsWith('image/')) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            setLicenseImagePreview(reader.result);
                                        };
                                        reader.readAsDataURL(file);
                                    } else if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
                                        setLicenseImagePreview(file.name);
                                    }
                                }
                            }}
                        />
                        {licenseImagePreview && (
                            <div className="mt-2">
                                {isImage ? (
                                    <img
                                        src={licenseImagePreview}
                                        alt="License Preview"
                                        className="h-32 w-32 object-cover rounded border-2 border-gray-300"
                                    />
                                ) : isPdf ? (
                                    <div className="flex items-center gap-2 p-2 border-2 border-gray-300 rounded">
                                        <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-sm text-gray-700">{typeof licenseImagePreview === 'string' && licenseImagePreview.includes('.pdf') ? licenseImagePreview : 'PDF File'}</span>
                                    </div>
                                ) : null}
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
                    required={isFieldRequired(adjustedSchema, fieldName)}
                />
            );
        }

        // For entity_category_id when mainProgramId === 1, use the already processed options directly
        // (they're processed with generateOptionsWithCustomLabel to show educational_entity_classification)
        const shouldUseProcessedOptions =
            fieldName === 'entity_category_id' && mainProgramId === 1;

        const fieldOptionsValue =
            fieldOptions ||
            enhancedOptions?.[fieldName] ||
            managerOptions[fieldName];

        // Disable activity_ids field if main_program_id is not selected
        const isActivityFieldDisabled = fieldName === 'activity_ids' && !mainProgramId;
        // Check if field has disabled property
        const isFieldDisabled = field.disabled || viewMode || isActivityFieldDisabled;

        return (
            <InputRFH
                p="px-3 py-3"
                control={control}
                register={register}
                error={error}
                disabled={isFieldDisabled}
                {...field}
                name={fieldName}
                options={
                    shouldUseProcessedOptions
                        ? fieldOptionsValue
                        : generateOptions(fieldOptionsValue)
                }
                defaultValue={defaultValue}
                required={isFieldRequired(adjustedSchema, fieldName)}
            />
        );
    };

    const filteredEntityFields = entitiesFields.filter(field => {
        // Check edit/view mode
        const modeMatch =
            (editMode && field.editMode) ||
            (viewMode && field.viewMode) ||
            (!editMode && !viewMode);

        if (!modeMatch) return false;

        // Check conditional fields
        if (field.conditional && field.showWhen) {
            // Handle main_program_id condition
            if (field.showWhen.main_program_id !== undefined) {
                const condition = field.showWhen.main_program_id;
                if (Array.isArray(condition)) {
                    return condition.includes(mainProgramId);
                } else {
                    return mainProgramId === condition;
                }
            }
            
            // Handle entry_type condition
            if (field.showWhen.entry_type !== undefined) {
                return entryType === field.showWhen.entry_type;
            }
        }

        return true;
    });

    const filteredManagerFields = managerFields.filter(
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
            <ModalContent className="space-y-4">
            <Accordion
                title={t('entities.entity_information')}
                open={openSections.entityInfo}
                onToggle={() => toggleSection('entityInfo')}
            >
                {/* Entity Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredEntityFields.map(field => (
                        <div
                            key={field.name}
                            className={
                                field.type === 'textarea'
                                    ? 'md:col-span-2 lg:col-span-3'
                                    : field.type === 'file' && field.name !== 'license_image'
                                    ? 'md:col-span-2 lg:col-span-3'
                                    : ''
                            }
                        >
                            {renderField(field)}
                        </div>
                    ))}
                </div>

                {/* Map Picker - at the end */}
                <div className="space-y-3 mt-6">
                    <h4 className="text-md font-medium text-gray-700">
                        {t('validation.map_location.label')}
                    </h4>
                    <MapPicker
                        onLocationSelect={({ lat, lng }) => {
                            setValue('latitude', lat, {
                                shouldValidate: true
                            });
                            setValue('longitude', lng, {
                                shouldValidate: true
                            });
                        }}
                        oldLocation={
                            oldData?.latitude && oldData?.longitude
                                ? {
                                      lat: oldData.latitude,
                                      lng: oldData.longitude
                                  }
                                : null
                        }
                        disabled={viewMode}
                    />
                    {errors.latitude && (
                        <p className="mt-1 h-4 text-xs text-red-600 font-montserrat">
                            {t(errors.latitude.message)}
                        </p>
                    )}
                </div>
            </Accordion>

            {/* Manager Information Section */}
            <Accordion
                title={t('entity_managers.manager_information')}
                open={openSections.managerInfo}
                onToggle={() => toggleSection('managerInfo')}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredManagerFields.map(field => (
                        <div
                            key={field.name}
                            className={
                                field.type === 'textarea'
                                    ? 'md:col-span-2 lg:col-span-3'
                                    : field.type === 'file' && field.name !== 'license_image'
                                    ? 'md:col-span-2 lg:col-span-3'
                                    : ''
                            }
                        >
                            {renderField(field, managerOptions[field.name])}
                        </div>
                    ))}
                </div>
            </Accordion>

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