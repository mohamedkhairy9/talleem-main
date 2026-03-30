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
import WarningModal from '@/components/common/form/WarningModal';
import { useEntitiesQuery } from '@/api/hooks/useEntities';
import { ASYNC_SELECT_PAGE_SIZE } from '@/utils/helpers/asyncSelectHelpers';
import { useRequiredDocumentsHint } from '@/api/hooks/useRequiredDocumentsHint';

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
    const [showWarningModal, setShowWarningModal] = useState(false);
    const [pendingSubmissionData, setPendingSubmissionData] = useState(null);
    const [existingManagerName, setExistingManagerName] = useState('');

    const { register, errors, handleSubmit, control, setValue, watch } = useRFH({
        schema,
        defaultValues: {
            ...oldData,
            date_of_birth: onlyDate(oldData?.date_of_birth),
            name: oldData?.name || { en: '', ar: '' },
            // Explicitly set nationality_id from oldData to ensure it's set
            nationality_id: oldData?.nationality_id || oldData?.nationality?.id || ''
        }
    });

    // Watch values
    const cityId = watch('city_id');
    const branchId = watch('branch_id');
    const mainProgramId = watch('main_program_id');
    const entityId = watch('entity_id');

    const { data: requiredDocsData } = useRequiredDocumentsHint('entity', mainProgramId);
    const filesSupportingHint = useMemo(() => {
        const docs = requiredDocsData?.documents;
        if (!docs?.length) return undefined;
        return docs.join('، ');
    }, [requiredDocsData]);

    // Query entities dynamically based on main_program_id and branch_id (with pagination)
    const entitiesQueryParams = useMemo(() => {
        const programId = mainProgramId || oldData?.main_program_id;
        const branch = branchId || oldData?.branch_id;

        if (!programId || !branch) {
            return null;
        }
        return {
            main_program_id: programId,
            branch_id: branch,
            page: 1,
            per_page: ASYNC_SELECT_PAGE_SIZE
        };
    }, [mainProgramId, branchId, oldData?.main_program_id, oldData?.branch_id]);

    // Fetch entities with dynamic params
    // Enable query if we have params OR if we're in edit/view mode (to show selected entity)
    const shouldEnableEntitiesQuery = !!entitiesQueryParams || (viewMode || editMode);
    const { data: entitiesData, isLoading: entitiesLoading } = useEntitiesQuery(
        entitiesQueryParams || {},
        { enabled: shouldEnableEntitiesQuery }
    );

    // Include selected entity from oldData in edit/view mode
    const filteredEntities = useMemo(() => {
        const entities = entitiesData?.data || [];
        
        // In view/edit mode, include selected entity even if not in fetched results
        if ((viewMode || editMode) && oldData?.entity_id && options?.entity_id) {
            const selectedEntity = options.entity_id.find(e => e.id === oldData.entity_id);
            if (selectedEntity && !entities.some(e => e.id === selectedEntity.id)) {
                return [selectedEntity, ...entities];
            }
        }
        
        return entities;
    }, [entitiesData, viewMode, editMode, oldData?.entity_id, options?.entity_id]);

    // Reset entity when branch changes (only in create mode)
    useEffect(() => {
        if (!editMode && !viewMode && branchId && branchId !== oldData?.branch_id) {
            setValue('entity_id', '');
        }
    }, [branchId, oldData?.branch_id, setValue, editMode, viewMode]);

    // Reset entity when main program changes (only in create mode)
    useEffect(() => {
        if (!editMode && !viewMode && mainProgramId && mainProgramId !== oldData?.main_program_id) {
            setValue('entity_id', '');
        }
    }, [mainProgramId, oldData?.main_program_id, setValue, editMode, viewMode]);

    // Note: nationality_id is now handled automatically by the async select component
    // through defaultOptions and oldData props, so no manual useEffect is needed

    // Enhanced options with filtered data
    const enhancedOptions = useMemo(() => ({
        ...options,
        entity_id: filteredEntities
    }), [options, filteredEntities]);

    // Get the selected entity to check for existing manager
    const selectedEntity = useMemo(() => {
        if (!entityId || !filteredEntities) return null;
        return filteredEntities.find(entity => entity.id === Number(entityId));
    }, [entityId, filteredEntities]);

    function prepareSubmissionData(data) {
        const submissionData = { ...data };
        // In edit mode, if profile image not changed, don't send it
        if (editMode && !profileImageChanged) {
            delete submissionData.profile_image;
        }

        // In edit mode, filter out file fields that are links (not File objects)
        // The API only accepts actual File objects, not URLs/links
        if (editMode && submissionData.files) {
            // Filter to only include File instances, exclude URL objects
            const fileArray = Array.isArray(submissionData.files) 
                ? submissionData.files 
                : [submissionData.files];
            
            const actualFiles = fileArray.filter(file => file instanceof File);
            
            // If there are actual files, use them; otherwise, remove the field
            if (actualFiles.length > 0) {
                submissionData.files = actualFiles;
            } else {
                delete submissionData.files;
            }
        }
        return submissionData;
    }

    function proceedWithSubmission(data) {
        const submissionData = prepareSubmissionData(data);
        mutate(submissionData, {
            onSuccess: () => {
                onClose();
            }
        });
    }

    function onSubmit(data) {
        // Check if selected entity has a manager (only in create mode or if entity changed in edit mode)
        const shouldCheckManager = !editMode || (editMode && entityId && entityId !== oldData?.entity_id);
        
        if (selectedEntity?.manager && shouldCheckManager) {
            // Get manager name from entity.manager
            const managerName = selectedEntity.manager.name?.[lang] || 
                              selectedEntity.manager.name?.en || 
                              selectedEntity.manager.name?.ar || 
                              t('common.entity_manager');
            setExistingManagerName(managerName);
            setPendingSubmissionData(data);
            setShowWarningModal(true);
            return;
        }

        // No existing manager, proceed with submission
        proceedWithSubmission(data);
    }

    function handleConfirmWarning() {
        setShowWarningModal(false);
        if (pendingSubmissionData) {
            proceedWithSubmission(pendingSubmissionData);
            setPendingSubmissionData(null);
        }
    }

    function handleCancelWarning() {
        setShowWarningModal(false);
        setPendingSubmissionData(null);
        setExistingManagerName('');
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

        // Entity field disabled until branch is selected
        if (fieldName === 'entity_id' && !branchId) {
            return true;
        }

        return false;
    };

    // Helper function to get the correct options for a field
    const getFieldOptions = (fieldName) => {
        // For fields that shouldn't be filtered, always use original options
        if (['main_program_id', 'academic_qualification_id', 'major_id', 'city_id', 'gender', 'status'].includes(fieldName)) {
            const generatedOptions = generateOptions(options[fieldName]);
            return generatedOptions;
        }
        
        // For filtered fields, use enhanced options
        return generateOptions(enhancedOptions[fieldName] || options[fieldName]);
    };

    return (
        <>
            {showWarningModal && (
                <WarningModal
                    onConfirm={handleConfirmWarning}
                    onCancel={handleCancelWarning}
                    loading={isPending}
                    title={t('entity_managers.warning.replace_manager_title')}
                    message={t('entity_managers.warning.replace_manager_message', { 
                        managerName: existingManagerName 
                    })}
                    confirmLabel={t('common.yes')}
                    cancelLabel={t('common.cancel')}
                />
            )}
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
                        // Special handling for branch field
                        if (field.name === 'branch_id') {
                            return (
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
                                        options={getFieldOptions(field.name)}
                                        defaultValue={oldData?.[field.name] || field.defaultValue}
                                        required={isFieldRequired(schema, field.name)}
                                    />
                                </div>
                            );
                        }

                        // Entity field: async paginated select filtered by branch + main program (page & per_page always sent)
                        // Key forces remount when branch/program change so async loadOptions gets fresh params and entity API is called
                        if (field.name === 'entity_id') {
                            const isEntityDisabled = !branchId || !mainProgramId || viewMode || entitiesLoading;

                            return (
                                <div key={`${field.name}-${branchId ?? ''}-${mainProgramId ?? ''}`}>
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
                                        oldData={oldData}
                                        fieldParams={{
                                            entity_id: {
                                                branch_id: branchId ?? oldData?.branch_id,
                                                main_program_id: mainProgramId ?? oldData?.main_program_id
                                            }
                                        }}
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
                                            hint={field.name === 'files' ? filesSupportingHint : undefined}
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
                                        oldData={oldData}
                                        defaultValue={(() => {
                                            // For nationality_id, ensure we get it from nationality object if available
                                            if (field.name === 'nationality_id') {
                                                return oldData?.nationality_id || oldData?.nationality?.id || field.defaultValue;
                                            }
                                            const defaultValue = oldData?.[field.name] || field.defaultValue;
                                            return defaultValue;
                                        })()}
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
        </>
    );
}