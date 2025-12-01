import useRFH from '@/utils/hooks/global/useRFH';
import { branchesSchema as schema } from '@/utils/yup/branches.schemas';
import React, { useEffect } from 'react';
import { branchesFields } from './configs';
import InputRFH from '@/components/common/inputs/InputRFH';
import Btn from '@/components/common/buttons/Btn';
import { getNestedError } from '@/utils/helpers/getNestedError';
import { generateOptions } from '@/utils/helpers/global.fns';
import ModalContent from '@/components/common/form/ModalContent';
import ModalFooter from '@/components/common/form/ModalFooter';
import { isFieldRequired } from '@/utils/helpers/schemaHelpers';

export default function FormBranch({
    onClose,
    oldData,
    editMode,
    viewMode,
    isPending,
    mutate,
    options,
    onCityChange,
    neighborhoodsLoading
}) {
    const { register, errors, handleSubmit, control, watch, setValue } = useRFH({
        schema,
        defaultValues: oldData
    });

    const cityId = watch('city_id');

    useEffect(() => {
        if (cityId && onCityChange) {
            onCityChange(cityId);
            // Clear neighborhood selection when city changes
            setValue('neighborhood_id', '');
        }
    }, [cityId, onCityChange, setValue]);

    function onSubmit(data) {
        console.log('data', data);
        mutate(data, {
            onSuccess: () => {
                onClose();
            }
        });
    }

    console.log('options', options);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
            <ModalContent>
            {branchesFields
                .filter(
                    field =>
                        (editMode && field.editMode) ||
                        (viewMode && field.viewMode) ||
                        (!editMode && !viewMode)
                )
                .map(field => (
                    <InputRFH
                        p="px-3 py-3"
                        control={control}
                        register={register}
                        error={getNestedError(errors, field.name)}
                        key={field.name}
                        type={field.type}
                        disabled={
                            viewMode ||
                            (field.name === 'neighborhood_id' && !cityId)
                        }
                        loading={
                            field.name === 'neighborhood_id' &&
                            neighborhoodsLoading
                        }
                        placeholder={field.placeholder}
                        label={field.label}
                        name={field.name}
                        defaultValue={
                            oldData?.[field.name] || field.defaultValue
                        }
                        options={generateOptions(options?.[field.name])}
                        required={isFieldRequired(schema, field.name)}
                    />
                ))}
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
