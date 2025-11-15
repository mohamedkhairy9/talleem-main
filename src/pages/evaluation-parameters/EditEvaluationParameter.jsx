import { useUpdateEvaluationParameterMutation } from '@/api/hooks/useEvaluationParameters';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import React from 'react';
import FormEvaluationParameter from './FormEvaluationParameter';
import { enabledDisabledOptions } from '@/utils/constants/options';
import useApiCalls from './useApiCalls';
import Loader from '@/components/common/Loader';
import { apiCalls } from './configs';

export default function EditEvaluationParameter({ onClose, oldData }) {
    const { mutate, isPending } = useUpdateEvaluationParameterMutation();
    const { mainProgramsData, isLoading } = useApiCalls({ apiCalls });

    if (isLoading) return <Loader />;
    
    return (
        <Modal onClose={onClose} size="4xl">
            <ModalHeader onClose={onClose} header="evaluation_parameters.update" />
            <FormEvaluationParameter
                oldData={oldData}
                mutate={mutate}
                isPending={isPending}
                onClose={onClose}
                editMode={true}
                mainProgramsData={mainProgramsData?.data}
            />
        </Modal>
    );
}