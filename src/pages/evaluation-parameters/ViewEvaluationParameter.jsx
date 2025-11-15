import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import React from 'react';
import FormEvaluationParameter from './FormEvaluationParameter';
import useApiCalls from './useApiCalls';
import Loader from '@/components/common/Loader';
import { apiCalls } from './configs';

export default function ViewEvaluationParameter({ onClose, oldData }) {
    const { mainProgramsData, isLoading } = useApiCalls({ apiCalls });

    if (isLoading) return <Loader />;

    return (
        <Modal onClose={onClose} size="4xl">
            <ModalHeader onClose={onClose} header="evaluation_parameters.view" />
            <FormEvaluationParameter
                oldData={oldData}
                onClose={onClose}
                editMode={false}
                viewMode={true}
                mainProgramsData={mainProgramsData?.data}
            />
        </Modal>
    );
}