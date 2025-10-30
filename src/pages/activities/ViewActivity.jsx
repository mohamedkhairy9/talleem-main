import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import React from 'react';
import FormActivity from './FormActivity';
import { enabledDisabledOptions } from '@/utils/constants/options';
import useApiCalls from './useApiCalls';
import Loader from '@/components/common/Loader';
import { apiCalls } from './configs';

export default function ViewActivity({ onClose, oldData }) {
    console.log('oldData', oldData);
    const { mainProgramsData, isLoading } = useApiCalls({ apiCalls });

    if (isLoading) return <Loader />;

    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="activities.view" />
            <FormActivity
                oldData={oldData}
                onClose={onClose}
                editMode={false}
                viewMode={true}
                options={{
                    status: enabledDisabledOptions,
                    main_program_id: mainProgramsData?.data
                }}
            />
        </Modal>
    );
}
