import useRFH from '@/utils/hooks/global/useRFH';
import { generalBannersSchema as schema } from '@/utils/yup/generalBanners.schemas';
import React, { useState } from 'react';
import { generalBannersFields } from './configs';
import InputRFH from '@/components/common/inputs/InputRFH';
import Btn from '@/components/common/buttons/Btn';
import { getNestedError } from '@/utils/helpers/getNestedError';
import { generateOptions } from '@/utils/helpers/global.fns';
import { onlyDate } from '@/utils/helpers/global.fns';
import ModalContent from '@/components/common/form/ModalContent';
import ModalFooter from '@/components/common/form/ModalFooter';
import { isFieldRequired } from '@/utils/helpers/schemaHelpers';

export default function FormGeneralBanner({
    onClose,
    oldData,
    editMode,
    viewMode,
    isPending,
    mutate,
    options
}) {
    const { register, errors, handleSubmit, control } = useRFH({
        schema,
        defaultValues: {
            ...oldData,
            start_date: onlyDate(oldData?.start_date),
            end_date: onlyDate(oldData?.end_date)
        }
    });
    const [imagePreview, setImagePreview] = useState(oldData?.image || null);
    const [imageChanged, setImageChanged] = useState(false);

    function onSubmit(data) {
        console.log('data', data);

        const submissionData = { ...data, status: data.status ? 1 : 0 };

        console.log('imageChanged', imageChanged);
        if (editMode && !imageChanged) {
            console.log('submissionData', submissionData);
            delete submissionData.image;
        }

        console.log('submissionData', submissionData);

        mutate(submissionData, {
            onSuccess: () => {
                onClose();
            }
        });
    }

    const handleImageChange = (e, field) => {
        console.log('field', field);

        const file = e.target.files?.[0];
        console.log('file', file);
        if (file) {
            setImageChanged(true);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
            <ModalContent>
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
                                    disabled={viewMode}
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
                            disabled={viewMode}
                            label={field.label}
                            name={field.name}
                            defaultValue={
                                oldData?.[field.name] || field.defaultValue
                            }
                            options={generateOptions(options?.[field.name])}
                        required={isFieldRequired(schema, field.name)}
                        />
                    );
                })}
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
