import { useUpdateWarningReasonMutation } from '@/api/hooks/useWarningReasons';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import React from 'react';
import FormWarningReason from './FormWarningReason';
import { enabledDisabledOptions } from '@/utils/constants/options';
import useApiCalls from './useApiCalls';
import Loader from '@/components/common/Loader';
import { apiCalls } from './configs';

export default function EditWarningReason({ onClose, oldData }) {

    const { mutate, isPending } = useUpdateWarningReasonMutation();
    const { mainProgramsData, isLoading } = useApiCalls({ apiCalls });

    if (isLoading) return <Loader />;
    
    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="warning_reasons.update" />
            <FormWarningReason
                oldData={oldData}
                mutate={mutate}
                isPending={isPending}
                onClose={onClose}
                editMode={true}
                options={{
                    status: enabledDisabledOptions,
                    main_program_id: mainProgramsData?.data
                }}
            />
        </Modal>
    );
}