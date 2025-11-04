import useRFH from '@/utils/hooks/global/useRFH';
import { entitiesSchema as schema } from '@/utils/yup/entities.schemas';
import React, { useEffect, useState } from 'react';
import { entitiesFields, managerFields } from './configs';
import InputRFH from '@/components/common/inputs/InputRFH';
import FileInputRFH from '@/components/common/inputs/FileInputRFH';
import Btn from '@/components/common/buttons/Btn';
import { getNestedError } from '@/utils/helpers/getNestedError';
import { generateOptions } from '@/utils/helpers/global.fns';
import useLocale from '@/utils/hooks/global/useLocale';
import MapPicker from '@/components/common/maps/MapPicker';
import Accordion from '@/components/common/UIs/Accordion';

export default function FormEntity({
    onClose,
    oldData,
    editMode,
    viewMode,
    isPending,
    mutate,
    options
}) {
    console.log("options: ", options)
    const { t } = useLocale();
    const [openSections, setOpenSections] = useState({
        entityInfo: true,
        managerInfo: false
    });
    const [profileImagePreview, setProfileImagePreview] = useState(
        oldData?.manager?.profile_image || null
    );
    const [profileImageChanged, setProfileImageChanged] = useState(false);

    const { register, errors, handleSubmit, control, setValue, watch } = useRFH(
        {
            schema,
            defaultValues: oldData
        }
    );

    console.log('errors', errors);

    function onSubmit(data) {
        console.log("Data: ", data);
        // Remove profile_image if not changed in edit mode
        if (editMode && data.manager && !profileImageChanged) {
            delete data.manager.profile_image;
        }

        mutate(
            {
                ...data,
                status: data.status,
                ...(data.main_program_id == 1
                    ? {
                          education_program_entity_type_id:
                              data.program_entity_types
                      }
                    : data.main_program_id == 2
                    ? {
                          memorization_program_entity_type_id:
                              data.program_entity_types
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

    const enhancedOptions = {
        ...options,
        neighborhood_id:
            options.neighborhood_id?.filter(
                neighborhood => neighborhood.city?.id === cityId
            ) || [],
        branch_id:
            options.branch_id?.filter(branch => branch.city?.id === cityId) ||
            [],
        program_entity_types:
            mainProgramId === 1
                ? options.education_program_entity_type_id
                : mainProgramId === 2
                ? options.memorization_program_entity_type_id
                : []
    };

    useEffect(() => {
        if (
            (mainProgramId && mainProgramId != oldData?.main_program_id) ||
            !oldData?.main_program_id
        ) {
            setValue('program_entity_types', '');
        }
    }, [mainProgramId, oldData?.main_program_id, setValue]);

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
                />
            );
        }

        return (
            <InputRFH
                p="px-3 py-3"
                control={control}
                register={register}
                error={error}
                disabled={viewMode}
                {...field}
                name={fieldName}
                options={generateOptions(
                    fieldOptions ||
                        enhancedOptions?.[fieldName] ||
                        managerOptions[fieldName]
                )}
                defaultValue={defaultValue}
            />
        );
    };

    const filteredEntityFields = entitiesFields.filter(
        field =>
            (editMode && field.editMode) ||
            (viewMode && field.viewMode) ||
            (!editMode && !viewMode)
    );

    const filteredManagerFields = managerFields.filter(
        field =>
            (editMode && field.editMode) ||
            (viewMode && field.viewMode) ||
            (!editMode && !viewMode)
    );

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-4 space-y-4  overflow-y-auto"
        >
            <Accordion
                title={t('entities.entity_information')}
                open={openSections.entityInfo}
                onToggle={() => toggleSection('entityInfo')}
            >
                {/* Map Picker */}
                <div className="space-y-3">
                    <h4 className="text-md font-medium text-gray-700">
                        {t('validation.address.label')}
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
                    <input type="hidden" {...register('latitude')} />
                    <input type="hidden" {...register('longitude')} />
                    {errors.latitude && (
                        <p className="mt-1 h-4 text-xs text-red-600 font-montserrat">
                            {t(errors.longitude.message)}
                        </p>
                    )}
                </div>

                {/* Entity Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredEntityFields.map(field => (
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
                            {renderField(field)}
                        </div>
                    ))}
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
                                    : field.type === 'file'
                                    ? 'md:col-span-2 lg:col-span-3'
                                    : ''
                            }
                        >
                            {renderField(field, managerOptions[field.name])}
                        </div>
                    ))}
                </div>
            </Accordion>

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
