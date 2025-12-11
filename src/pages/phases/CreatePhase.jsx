import React from 'react';
import FormPhase from './FormPhase';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useCreatePhaseMutation } from '@/api/hooks/usePhases';
import { enabledDisabledOptions } from '@/utils/constants/options';
import useApiCalls from './useApiCalls';
import Loader from '@/components/common/Loader';
import { apiCalls } from './configs';
import { usePhasesQuery } from '@/api/hooks/usePhases';

export default function CreatePhase({ onClose }) {
    const { mutate, isPending } = useCreatePhaseMutation();
    const { data: phasesData } = usePhasesQuery();
    const { requestTypesData, isLoading } = useApiCalls({ apiCalls });

    // Get the next order number
    const getNextOrder = () => {
        if (!phasesData?.data || phasesData.data.length === 0) return 1;
        const maxOrder = Math.max(...phasesData.data.map(p => p.order || 0));
        return maxOrder + 1;
    };

    if (isLoading) return <Loader />;

    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="phases.create" />
            <FormPhase
                mutate={mutate}
                isPending={isPending}
                onClose={onClose}
                options={{
                    status: enabledDisabledOptions,
                    request_type_id: requestTypesData?.data
                }}
                oldData={{ 
                    status: true,
                    order: getNextOrder()
                }}
            />
        </Modal>
    );
}

