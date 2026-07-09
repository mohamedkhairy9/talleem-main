import React, { useMemo } from 'react';
import * as yup from 'yup';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import ModalContent from '@/components/common/form/ModalContent';
import ModalFooter from '@/components/common/form/ModalFooter';
import InputRFH from '@/components/common/inputs/InputRFH';
import useRFH from '@/utils/hooks/global/useRFH';
import Btn from '@/components/common/buttons/Btn';
import useLocale from '@/utils/hooks/global/useLocale';

const getTodayDate = () => new Date().toISOString().split('T')[0];

export default function IssueLicenseModal({
    isOpen = true,
    onClose,
    onSubmit,
    isPending = false,
    title,
    submitLabel,
    notesLabel,
    issueDateLabel,
    notesPlaceholder,
    issueDatePlaceholder
}) {
    const { t } = useLocale();

    const schema = useMemo(
        () =>
            yup.object({
                issue_date: yup.string().required(t('validation.required')),
                notes: yup.string().nullable().default('')
            }),
        [t]
    );

    const { register, errors, handleSubmit, control } = useRFH({
        schema,
        defaultValues: {
            issue_date: getTodayDate(),
            notes: ''
        }
    });

    const handleFormSubmit = values => {
        onSubmit({
            ...values,
            notes: values.notes || ''
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalHeader onClose={onClose} header={title} />
            <form onSubmit={handleSubmit(handleFormSubmit)} className="flex h-full flex-col">
                <ModalContent className="space-y-4">
                    <InputRFH
                        control={control}
                        register={register}
                        error={errors.issue_date?.message}
                        label={issueDateLabel}
                        placeholder={issueDatePlaceholder}
                        name="issue_date"
                        type="date"
                        disabled={isPending}
                        required={true}
                    />

                    <InputRFH
                        control={control}
                        register={register}
                        error={errors.notes?.message}
                        label={notesLabel}
                        placeholder={notesPlaceholder}
                        name="notes"
                        type="textarea"
                        disabled={isPending}
                    />
                </ModalContent>

                <ModalFooter className="flex justify-end">
                    <Btn
                        type="submit"
                        loading={isPending}
                        className="w-full sm:w-auto px-6 py-[10px]"
                        label={submitLabel}
                    />
                </ModalFooter>
            </form>
        </Modal>
    );
}
