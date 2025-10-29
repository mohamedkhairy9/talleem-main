import useRFH from '@/utils/hooks/global/useRFH';
import { entitiesSchema as schema } from '@/utils/yup/entities.schemas';
import React from 'react';
import { entitiesFields } from './configs';
import InputRFH from '@/components/common/inputs/InputRFH';
import FileInputRFH from '@/components/common/inputs/FileInputRFH';
import Btn from '@/components/common/buttons/Btn';
import { getNestedError } from '@/utils/helpers/getNestedError';
import { generateOptions } from '@/utils/helpers/global.fns';
import useLocale from '@/utils/hooks/global/useLocale';
import MapPicker from '@/components/common/maps/MapPicker';

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
    const { register, errors, handleSubmit, control, setValue } = useRFH({
        schema,
        defaultValues: {
            ...oldData,
            activities: oldData?.activities?.length
                ? oldData.activities
                : [{ main_program_id: '', name: { en: '', ar: '' } }],
            class_count: oldData?.class_count ?? 0,
            management_rooms_count: oldData?.management_rooms_count ?? 0,
            lecture_holes_count: oldData?.lecture_holes_count ?? 0,
            min_acceptance_age: oldData?.min_acceptance_age ?? 1,
            latitude: oldData?.latitude ?? '',
            longitude: oldData?.longitude ?? ''
        }
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
            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-800">
                    {t('validation.address.label')}
                </h3>
                <MapPicker
                    onLocationSelect={({ lat, lng }) => {
                        setValue('latitude', lat, { shouldValidate: true });
                        setValue('longitude', lng, { shouldValidate: true });
                    }}
                    oldLocation={
                        oldData?.latitude && oldData?.longitude
                            ? { lat: oldData.latitude, lng: oldData.longitude }
                            : null
                    }
                    disabled={viewMode}
                />
                <input type="hidden" {...register('latitude')} />
                <input type="hidden" {...register('longitude')} />
            </div>
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
