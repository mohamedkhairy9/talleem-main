import useRFH from '@/utils/hooks/global/useRFH';
import { parentsSchema as schema } from '@/utils/yup/parents.schemas';
import React from 'react';
import { parentsFields } from './configs';
import InputRFH from '@/components/common/inputs/InputRFH';
import Btn from '@/components/common/buttons/Btn';
import { getNestedError } from '@/utils/helpers/getNestedError';
import ModalContent from '@/components/common/form/ModalContent';
import ModalFooter from '@/components/common/form/ModalFooter';
import { isFieldRequired } from '@/utils/helpers/schemaHelpers';

export default function FormParent({
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
            name: oldData?.name || { en: '', ar: '' }
        }
    });

    function onSubmit(data) {
        console.log('data', data);
        mutate(data, {
            onSuccess: () => {
                onClose();
            }
        });
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
            <ModalContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {parentsFields
                    .filter(
                        field =>
                            (editMode && field.editMode) ||
                            (viewMode && field.viewMode) ||
                            (!editMode && !viewMode)
                    )
                    .map(field => (
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
                                defaultValue={
                                    field.name.includes('.')
                                        ? field.name
                                              .split('.')
                                              .reduce(
                                                  (obj, key) => obj?.[key],
                                                  oldData
                                              )
                                        : oldData?.[field.name] ||
                                          field.defaultValue
                                }
                                required={isFieldRequired(schema, field.name)}
                            />
                        </div>
                    ))}
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
    );
}
