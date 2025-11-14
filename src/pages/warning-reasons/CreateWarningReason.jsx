import React from 'react';
import FormWarningReason from './FormWarningReason';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useCreateWarningReasonMutation } from '@/api/hooks/useWarningReasons';
import { enabledDisabledOptions } from '@/utils/constants/options';
import useApiCalls from './useApiCalls';
import Loader from '@/components/common/Loader';
import { API_KEYS } from '@/api/endpoints';
import { apiCalls } from './configs';

export default function CreateWarningReason({ onClose }) {
    const { mutate, isPending } = useCreateWarningReasonMutation();

    const { mainProgramsData, isLoading } = useApiCalls({ apiCalls });

    if (isLoading) return <Loader />;

    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="warning_reasons.create" />
            <FormWarningReason
                mutate={mutate}
                isPending={isPending}
                onClose={onClose}
                options={{
                    status: enabledDisabledOptions,
                    main_program_id: mainProgramsData?.data
                }}
                oldData={{ status: true }}
            />
        </Modal>
    );
}