import useRFH from '@/utils/hooks/global/useRFH';
import { branchAdministrationsSchema as schema } from '@/utils/yup/branchAdministrations.schemas';
import React from 'react';
import { branchAdministrationsFields } from './configs';
import InputRFH from '@/components/common/inputs/InputRFH';
import Btn from '@/components/common/buttons/Btn';
import { getNestedError } from '@/utils/helpers/getNestedError';
import { generateOptions } from '@/utils/helpers/global.fns';
import { enabledDisabledOptions } from '@/utils/constants/options';
import ModalContent from '@/components/common/form/ModalContent';
import ModalFooter from '@/components/common/form/ModalFooter';
import { isFieldRequired } from '@/utils/helpers/schemaHelpers';

export default function FormBranchAdministration({
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
        defaultValues: oldData || {
            name: { en: '', ar: '' },
            status: 1
        }
    });

    function onSubmit(data) {
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
                    {branchAdministrationsFields
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
                                    field.type === 'textarea' ? 'md:col-span-2' : ''
                                }
                            >
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
                                            ? field.name.split('.').reduce((obj, key) => obj?.[key], oldData) || field.defaultValue
                                            : oldData?.[field.name] || field.defaultValue
                                    }
                                    options={
                                        field.name === 'status'
                                            ? generateOptions(enabledDisabledOptions)
                                            : generateOptions(options?.[field.name])
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
