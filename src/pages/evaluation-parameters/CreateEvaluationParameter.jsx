import React from 'react';
import FormEvaluationParameter from './FormEvaluationParameter';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useCreateEvaluationParameterMutation } from '@/api/hooks/useEvaluationParameters';
import useApiCalls from './useApiCalls';
import Loader from '@/components/common/Loader';
import { apiCalls } from './configs';

export default function CreateEvaluationParameter({ onClose }) {
    const { mutate, isPending } = useCreateEvaluationParameterMutation();
    const { mainProgramsData, isLoading } = useApiCalls({ apiCalls });

    if (isLoading) return <Loader />;
    return (
        <Modal onClose={onClose} size="4xl">
            <ModalHeader onClose={onClose} header="evaluation_parameters.create" />
            <FormEvaluationParameter
                mutate={mutate}
                isPending={isPending}
                onClose={onClose}
                mainProgramsData={mainProgramsData?.data}
                oldData={{ 
                    is_active: true,
                    criteria: [{ criteria_name: { en: '', ar: '' }, degree: '' }]
                }}
            />
        </Modal>
    );
}