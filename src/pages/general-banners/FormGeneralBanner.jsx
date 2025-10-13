import useRFH from '@/utils/hooks/global/useRFH';
import { generalBannersSchema as schema } from '@/utils/yup/generalBanners.schemas';
import React, { useState } from 'react';
import { generalBannersFields } from './configs';
import InputRFH from '@/components/common/inputs/InputRFH';
import Btn from '@/components/common/buttons/Btn';
import { getNestedError } from '@/utils/helpers/getNestedError';
import { generateOptions } from '@/utils/helpers/global.fns';

export default function FormGeneralBanner({
    onClose,
    oldData,
    editMode,
    viewMode,
    isPending,
    mutate,
    options
}) {
    const { register, errors, handleSubmit, control, setValue } = useRFH({
        schema,
        defaultValues: oldData
    });
    const [imagePreview, setImagePreview] = useState(oldData?.image || null);

    function onSubmit(data) {
        console.log('data', data);
        mutate(data, {
            onSuccess: () => {
                onClose();
            }
        });
    }

    const handleImageChange = (e, field) => {
        const file = e.target.files?.[0];
        if (file) {
            setValue(field.name, file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-2">
            {generalBannersFields
                .filter(
                    field =>
                        (editMode && field.editMode) ||
                        (viewMode && field.viewMode) ||
                        (!editMode && !viewMode)
                )
                .map(field => {
                    if (field.type === 'file') {
                        return (
                            <div key={field.name} className="space-y-2">
                                <InputRFH
                                    p="px-3 py-3"
                                    control={control}
                                    register={register}
                                    error={getNestedError(errors, field.name)}
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    label={field.label}
                                    name={field.name}
                                    accept={field.accept}
                                    onChange={e => handleImageChange(e, field)}
                                />
                                {imagePreview && (
                                    <div className="mt-2">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="h-32 w-48 object-cover rounded-md border border-gray-300"
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    }

                    return (
                        <InputRFH
                            p="px-3 py-3"
                            control={control}
                            register={register}
                            error={getNestedError(errors, field.name)}
                            key={field.name}
                            type={field.type}
                            placeholder={field.placeholder}
                            label={field.label}
                            name={field.name}
                            defaultValue={oldData?.[field.name]}
                            options={generateOptions(options?.[field.name])}
                        />
                    );
                })}
            <Btn
                loading={isPending}
                className="py-[10px] w-full"
                type="submit"
                label="common.submit"
            />
        </form>
    );
}
