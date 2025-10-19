import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import useRFH from '@/utils/hooks/global/useRFH';
import { employeesSchema as schema } from '@/utils/yup/employees.schemas';
import React from 'react';
import { employeesFields } from './configs';
import InputRFH from '@/components/common/inputs/InputRFH';
import Btn from '@/components/common/buttons/Btn';
import { getNestedError } from '@/utils/helpers/getNestedError';
import { generateOptions } from '@/utils/helpers/global.fns';
import { onlyDate } from '@/utils/helpers/global.fns';

export default function FormEmployee({
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
            date_of_birth: onlyDate(oldData?.date_of_birth)
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
        <Modal onClose={onClose} size="4xl">
            <ModalHeader
                onClose={onClose}
                title={
                    editMode
                        ? 'common.edit'
                        : viewMode
                        ? 'common.view'
                        : 'common.add'
                }
            />
            <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {employeesFields
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
                                        ? 'md:col-span-2'
                                        : ''
                                }
                            >
                                <InputRFH
                                    p="px-3 py-3"
                                    control={control}
                                    register={register}
                                    error={getNestedError(errors, field.name)}
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    label={field.label}
                                    name={field.name}
                                    defaultValue={oldData?.[field.name]}
                                    options={generateOptions(
                                        options?.[field.name]
                                    )}
                                />
                            </div>
                        ))}
                </div>
                <Btn
                    loading={isPending}
                    className="py-[10px] w-full"
                    type="submit"
                    label="common.submit"
                />
            </form>
        </Modal>
    );
}
