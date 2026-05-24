import InputRFH from '@/components/common/inputs/InputRFH';
import FileInputRFH from '@/components/common/inputs/FileInputRFH';
import ProfileImageField from './ProfileImageField';
import { getNestedError } from '@/utils/helpers/getNestedError';
import { generateOptions } from '@/utils/helpers/global.fns';
import useLocale from '@/utils/hooks/global/useLocale';
import i18next from 'i18next';

export default function StudentFormField({
    field,
    control,
    register,
    errors,
    watch,
    viewMode,
    options,
    enhancedOptions,
    mainProgramId,
    branchId,
    entitiesLoading,
    categoryDisplayValue,
    profileImagePreview,
    onProfileImageChange,
    isConditionallyRequired,
    oldData,
    setValue,
    filesSupportingHint,
    segmentationChangeLocked
}) {
    const { t } = useLocale();
    const lang = i18next.language;

    // Hide issue_description if has_medical_issues is not 1
    if (field.name === 'issue_description' && watch('has_medical_issues') !== 1) {
        return null;
    }

    // Special handling for classification field (read-only, auto-filled)
    if (field.name === 'education_program_entity_type_classification') {
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
                    disabled={true}
                    label={field.label}
                    name={field.name}
                    info={field.info}
                    required={isRequired}
                />
            </div>
        );
    }

    // Special handling for category field (display educational_entity_classification)
    if (field.name === 'entity_category_id') {
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
                <input type="hidden" {...register('entity_category_id')} />
                <p className="mt-1 h-4 text-xs text-red-600" role="alert">
                    {t(getNestedError(errors, field.name)) || ''}
                </p>
            </div>
        );
    }

    // Special handling for memorization program entity type field
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
                <input type="hidden" {...register('memorization_program_entity_type')} />
                <p className="mt-1 h-4 text-xs text-red-600" role="alert">
                    {t(getNestedError(errors, field.name)) || ''}
                </p>
            </div>
        );
    }

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
                    disabled={viewMode || segmentationChangeLocked}
                    label={field.label}
                    name={field.name}
                    info={field.info}
                    options={generateOptions(enhancedOptions[field.name] || options[field.name] || [])}
                    required={true}
                />
            </div>
        );
    }

    // Special handling for entity field
    if (field.name === 'entity_id') {
        const isEntityDisabled =
            !branchId || !mainProgramId || viewMode || segmentationChangeLocked;
        // Get loadOptions and defaultOptions from hook (passed via enhancedOptions or as separate props)
        const entityLoadOptions = enhancedOptions._entityLoadOptions;
        const entityDefaultOptions = enhancedOptions._entityDefaultOptions;
        // Create a key that changes when params are ready to force reload
        const entityKey = `${field.name}-${branchId || ''}-${mainProgramId || ''}`;
        
        return (
            <div key={entityKey}>
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
                    required={true}
                    loading={entitiesLoading}
                    isAsync={true}
                    loadOptions={entityLoadOptions}
                    defaultOptions={entityDefaultOptions}
                    oldData={oldData}
                    fieldParams={{}}
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
                    <ProfileImageField
                        control={control}
                        register={register}
                        errors={errors}
                        viewMode={viewMode}
                        profileImagePreview={profileImagePreview}
                        onImageChange={onProfileImageChange}
                        required={isConditionallyRequired(field)}
                    />
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
                        hint={field.name === 'files' ? filesSupportingHint : undefined}
                    />
                )
            ) : (
                <InputRFH
                    p="px-3 py-3"
                    control={control}
                    register={register}
                    error={getNestedError(errors, field.name)}
                    type={field.type}
                    placeholder={field.placeholder}
                    disabled={
                        viewMode ||
                        (segmentationChangeLocked &&
                            ['main_program_id', 'branch_id', 'entity_id'].includes(field.name))
                    }
                    label={field.label}
                    name={field.name}
                    info={field.info}
                    options={generateOptions(enhancedOptions[field.name] || options[field.name])}
                    min={field.min}
                    max={field.max}
                    required={isConditionallyRequired(field)}
                />
            )}
        </div>
    );
}

