import React, { useMemo, useCallback, useRef } from 'react';
import useRFH from '@/utils/hooks/global/useRFH';
import { studentsSchema } from '@/utils/yup/students.schemas';
import Btn from '@/components/common/buttons/Btn';
import ModalContent from '@/components/common/form/ModalContent';
import ModalFooter from '@/components/common/form/ModalFooter';
import { useStudentForm } from './hooks/useStudentForm';
import { studentsFields } from './configs';
import StudentFormField from './components/StudentFormField';
import ParentInformationSection from './components/ParentInformationSection';
import QualificationSection from './components/QualificationSection';
import ValidationErrorsSummary from './components/ValidationErrorsSummary';
import { onlyDate } from '@/utils/helpers/global.fns';
import i18next from 'i18next';
import {
    getIsConditionallyRequired,
    getCategoryDisplayValue,
    filterMainFields,
    filterParentFields,
    prepareSubmissionData
} from './utils/studentFormHelpers';
import { useRequiredDocumentsHint } from '@/api/hooks/useRequiredDocumentsHint';
import { useConfigurationsQuery } from '@/api/hooks/useConfigurations';
import useLocale from '@/utils/hooks/global/useLocale';
import toastService from '@/utils/helpers/Toastservice';
import Loader from '@/components/common/Loader';
import {
    getActiveHalaqaInfo,
    hasSegmentationAffectingChange,
    isMemorizationProgramSelected
} from '@/utils/helpers/activeHalaqaGuard';
import {
    DEFAULT_PARENT_INFO_AGE_THRESHOLD,
    resolveParentInfoAgeThreshold
} from './utils/parentInfoThreshold';

// Helper to extract education entity type data from oldData
const extractEducationEntityTypeData = (oldData) => {
    if (!oldData?.education_program_entity_type_id) {
        return { id: null, classification: null, name: null };
    }
    const educationEntityType = oldData.education_program_entity_type_id;
    if (typeof educationEntityType === 'object' && educationEntityType !== null) {
        return {
            id: educationEntityType.id,
            classification: educationEntityType.educational_entity_classification,
            name: educationEntityType.name
        };
    }
    return { id: educationEntityType, classification: null, name: null };
};

function StudentFormContent({
    onClose,
    oldData,
    activeHalaqaRecord,
    editMode,
    viewMode,
    isPending,
    mutate,
    options,
    parentInfoAgeThreshold
}) {
    const { t } = useLocale();
    const lang = i18next.language;

    // Create stable defaultValues (only once)
    const defaultValuesRef = useRef(null);
    const oldDataIdRef = useRef(null);

    if (defaultValuesRef.current === null || oldDataIdRef.current !== oldData?.id) {
        const educationEntityTypeInfo = extractEducationEntityTypeData(oldData);
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

        if ((editMode || viewMode) && educationEntityTypeInfo.id) {
            baseValues.entity_category_id = educationEntityTypeInfo.id;
            if (educationEntityTypeInfo.name) {
                baseValues.education_program_entity_type_classification =
                    educationEntityTypeInfo.name[lang] ||
                    educationEntityTypeInfo.name.en ||
                    educationEntityTypeInfo.name.ar;
            }
        }

        // Convert status from 1/0 to true/false for form compatibility
        if (baseValues.status !== undefined) {
            baseValues.status = baseValues.status === 1 || baseValues.status === true;
        }

        defaultValuesRef.current = baseValues;
        oldDataIdRef.current = oldData?.id;
    }

    const schema = useMemo(
        () => studentsSchema(parentInfoAgeThreshold),
        [parentInfoAgeThreshold]
    );

    const { register, errors, handleSubmit, setValue, control, watch } = useRFH({
        schema,
        defaultValues: defaultValuesRef.current || {}
    });

    // Watch form values
    const hasHighSchool = watch('qualification.has_high_school');
    const hasBachelors = watch('qualification.has_bachelors_degree');
    const hasMemorizedFive = watch('qualification.has_memorized_quran_5_parts');
    const activeHalaqaInfo = useMemo(
        () => getActiveHalaqaInfo(activeHalaqaRecord || oldData),
        [activeHalaqaRecord, oldData]
    );

    // Use custom hook for API calls and side effects only
    const {
        profileImagePreview,
        profileImageChanged,
        setProfileImagePreview,
        setProfileImageChanged,
        educationEntityTypeInfo,
        entities,
        entitiesLoading,
        selectedEntityEducationType,
        shouldShowParentFields,
        mainProgramId,
        branchId,
        entityLoadOptions,
        entityDefaultOptions
    } = useStudentForm({
        oldData,
        editMode,
        viewMode,
        watch,
        setValue,
        parentInfoAgeThreshold
    });

    const { data: requiredDocsData } = useRequiredDocumentsHint('student', mainProgramId);
    const filesSupportingHint = useMemo(() => {
        const docs = requiredDocsData?.documents;
        if (!docs?.length) return undefined;
        return docs.join('ØŒ ');
    }, [requiredDocsData]);

    // Enhanced options with dynamic entities and loadOptions
    const enhancedOptions = useMemo(() => ({
        ...options,
        entity_id: entities,
        _entityLoadOptions: entityLoadOptions,
        _entityDefaultOptions: entityDefaultOptions
    }), [options, entities, entityLoadOptions, entityDefaultOptions]);

    // Get display value for category
    const categoryDisplayValue = useMemo(() =>
        getCategoryDisplayValue(selectedEntityEducationType, educationEntityTypeInfo),
    [selectedEntityEducationType, educationEntityTypeInfo]);

    // Filter fields
    const mainFields = useMemo(() =>
        filterMainFields(studentsFields, editMode, viewMode, mainProgramId),
    [editMode, viewMode, mainProgramId]);

    const parentFields = useMemo(() =>
        filterParentFields(studentsFields, editMode, viewMode),
    [editMode, viewMode]);

    // Helper to check if field is conditionally required
    const isConditionallyRequired = useCallback((field) =>
        getIsConditionallyRequired(field, mainProgramId, schema),
    [mainProgramId, schema]);
    const segmentationChangeLocked =
        editMode &&
        activeHalaqaInfo.hasActiveHalaqas &&
        isMemorizationProgramSelected(mainProgramId, oldData?.main_program_id);

    // Handle profile image change
    const handleProfileImageChange = useCallback((e) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfileImageChanged(true);
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }, [setProfileImageChanged, setProfileImagePreview]);

    // Handle form submission
    const onSubmit = useCallback((data) => {
        if (
            segmentationChangeLocked &&
            hasSegmentationAffectingChange({
                oldData,
                currentMainProgramId: data.main_program_id,
                currentBranchId: data.branch_id,
                currentEntityId: data.entity_id,
                currentEntityCategoryId: data.entity_category_id
            })
        ) {
            toastService.error(t('common.segmentationLockedActiveHalaqas'));
            return;
        }

        const finalData = prepareSubmissionData(data, editMode, profileImageChanged);
        mutate(finalData, {
            onSuccess: () => {
                onClose();
            }
        });
    }, [
        editMode,
        mutate,
        oldData,
        onClose,
        profileImageChanged,
        segmentationChangeLocked,
        t
    ]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
            <ModalContent>
                {segmentationChangeLocked && (
                    <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                        <p className="font-semibold">{t('common.segmentationLockedTitle')}</p>
                        <p>{t('common.segmentationLockedActiveHalaqas')}</p>
                    </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mainFields.map(field => (
                        <StudentFormField
                            key={field.name}
                            field={field}
                            control={control}
                            register={register}
                            errors={errors}
                            watch={watch}
                            viewMode={viewMode}
                            options={options}
                            enhancedOptions={enhancedOptions}
                            mainProgramId={mainProgramId}
                            branchId={branchId}
                            entitiesLoading={entitiesLoading}
                            categoryDisplayValue={categoryDisplayValue}
                            profileImagePreview={profileImagePreview}
                            onProfileImageChange={handleProfileImageChange}
                            isConditionallyRequired={isConditionallyRequired}
                            oldData={oldData}
                            setValue={setValue}
                            filesSupportingHint={filesSupportingHint}
                            segmentationChangeLocked={segmentationChangeLocked}
                        />
                    ))}
                </div>

                {shouldShowParentFields && (
                    <ParentInformationSection
                        fields={parentFields}
                        control={control}
                        register={register}
                        errors={errors}
                        viewMode={viewMode}
                        options={options}
                        isConditionallyRequired={isConditionallyRequired}
                    />
                )}

                {Number(mainProgramId) === 1 && (
                    <QualificationSection
                        control={control}
                        register={register}
                        errors={errors}
                        viewMode={viewMode}
                        options={options}
                        hasHighSchool={hasHighSchool}
                        hasBachelors={hasBachelors}
                        hasMemorizedFive={hasMemorizedFive}
                    />
                )}

                {!viewMode && <ValidationErrorsSummary errors={errors} />}
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

export default function FormStudent(props) {
    const { data: configurationsData, isLoading: configurationsLoading } = useConfigurationsQuery('all');

    const parentInfoAgeThreshold = useMemo(
        () => resolveParentInfoAgeThreshold(configurationsData?.data),
        [configurationsData?.data]
    );

    if (configurationsLoading && !configurationsData?.data) {
        return <Loader />;
    }

    return (
        <StudentFormContent
            key={`student-form-threshold-${parentInfoAgeThreshold}`}
            {...props}
            parentInfoAgeThreshold={parentInfoAgeThreshold || DEFAULT_PARENT_INFO_AGE_THRESHOLD}
        />
    );
}
