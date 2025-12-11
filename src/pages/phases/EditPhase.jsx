import { useUpdatePhaseMutation } from '@/api/hooks/usePhases';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import React from 'react';
import FormPhase from './FormPhase';
import { enabledDisabledOptions } from '@/utils/constants/options';
import useApiCalls from './useApiCalls';
import Loader from '@/components/common/Loader';
import { apiCalls } from './configs';

export default function EditPhase({ onClose, oldData }) {
    const { mutate, isPending } = useUpdatePhaseMutation();
    const { requestTypesData, isLoading } = useApiCalls({ apiCalls });

    if (isLoading) return <Loader />;

    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="phases.update" />
            <FormPhase
                oldData={oldData}
                mutate={mutate}
                isPending={isPending}
                onClose={onClose}
                editMode={true}
                options={{
                    status: enabledDisabledOptions,
                    request_type_id: requestTypesData?.data
                }}
            />
        </Modal>
    );
}

