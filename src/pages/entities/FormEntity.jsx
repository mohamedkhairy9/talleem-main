import useRFH from '@/utils/hooks/global/useRFH';
import { entitiesSchema as schema } from '@/utils/yup/entities.schemas';
import React from 'react';
import { entitiesFields } from './configs';
import InputRFH from '@/components/common/inputs/InputRFH';
import FileInputRFH from '@/components/common/inputs/FileInputRFH';
import Btn from '@/components/common/buttons/Btn';
import { getNestedError } from '@/utils/helpers/getNestedError';
import { generateOptions } from '@/utils/helpers/global.fns';
import { useFieldArray } from 'react-hook-form';
import { MdAdd, MdDelete } from 'react-icons/md';
import useLocale from '@/utils/hooks/global/useLocale';

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
    const { register, errors, handleSubmit, control } = useRFH({
        schema,
        defaultValues: {
            ...oldData,
            activities: oldData?.activities?.length
                ? oldData.activities
                : [{ main_program_id: '', name: { en: '', ar: '' } }],
            class_count: oldData?.class_count ?? 0,
            management_rooms_count: oldData?.management_rooms_count ?? 0,
            lecture_holes_count: oldData?.lecture_holes_count ?? 0,
            min_acceptance_age: oldData?.min_acceptance_age ?? 1
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'activities'
    });

    function onSubmit(data) {
        console.log('data', data);
        mutate(
            { ...data, status: data.status },
            {
                onSuccess: () => {
                    onClose();
                }
            }
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {entitiesFields
                    .filter(
                        field =>
                            (editMode && field.editMode) ||
                            (viewMode && field.viewMode) ||
                            (!editMode && !viewMode)
                    )
                    .map(field => (
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
                            {field.type === 'file' ? (
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
                                    p="px-3 py-3"
                                    control={control}
                                    register={register}
                                    error={getNestedError(errors, field.name)}
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    disabled={viewMode}
                                    label={field.label}
                                    name={field.name}
                                    options={generateOptions(
                                        options?.[field.name]
                                    )}
                                    defaultValue={
                                        oldData?.[field.name] ||
                                        field.defaultValue
                                    }
                                />
                            )}
                        </div>
                    ))}
            </div>

            {/* Activities Section */}
            <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">
                        {t('entities.activities')}
                    </h3>
                    {!viewMode && (
                        <button
                            type="button"
                            onClick={() =>
                                append({
                                    main_program_id: '',
                                    name: { en: '', ar: '' }
                                })
                            }
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <MdAdd className="w-5 h-5" />
                            <span>{t('entities.add_activity')}</span>
                        </button>
                    )}
                </div>

                {fields.map((field, index) => (
                    <div
                        key={field.id}
                        className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-4"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-gray-700">
                                {t('entities.activity')} {index + 1}
                            </h4>
                            {!viewMode && fields.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                                >
                                    <MdDelete className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <InputRFH
                                p="px-3 py-3"
                                control={control}
                                register={register}
                                error={getNestedError(
                                    errors,
                                    `activities.${index}.main_program_id`
                                )}
                                type="select"
                                placeholder="validation.main_program_id.placeholder"
                                disabled={viewMode}
                                label="validation.main_program_id.label"
                                name={`activities.${index}.main_program_id`}
                                options={generateOptions(
                                    options?.main_program_id
                                )}
                                defaultValue={
                                    oldData?.activities?.[index]
                                        ?.main_program_id || ''
                                }
                            />
                            <InputRFH
                                p="px-3 py-3"
                                control={control}
                                register={register}
                                error={getNestedError(
                                    errors,
                                    `activities.${index}.name.en`
                                )}
                                type="text"
                                placeholder="validation.name.placeholder.en"
                                disabled={viewMode}
                                label="validation.name.label.en"
                                name={`activities.${index}.name.en`}
                                defaultValue={
                                    oldData?.activities?.[index]?.name?.en || ''
                                }
                            />
                            <InputRFH
                                p="px-3 py-3"
                                control={control}
                                register={register}
                                error={getNestedError(
                                    errors,
                                    `activities.${index}.name.ar`
                                )}
                                type="text"
                                placeholder="validation.name.placeholder.ar"
                                disabled={viewMode}
                                label="validation.name.label.ar"
                                name={`activities.${index}.name.ar`}
                                defaultValue={
                                    oldData?.activities?.[index]?.name?.ar || ''
                                }
                            />
                        </div>
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
