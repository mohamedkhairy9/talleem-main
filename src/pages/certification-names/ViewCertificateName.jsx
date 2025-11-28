import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import React from 'react';
import FormCertificateName from './FormCertificateName';
import { enabledDisabledOptions } from '@/utils/constants/options';
import Loader from '@/components/common/Loader';
import useApiCalls from './useApiCalls';
import { apiCalls } from './configs';

export default function ViewCertificateName({ onClose, oldData }) {
    console.log('oldData', oldData);

    const { mainProgramsData, isLoading } = useApiCalls({ apiCalls });

    if (isLoading) return <Loader />;

    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="certificate_names.view" />
            <FormCertificateName
                oldData={oldData}
                onClose={onClose}
                editMode={false}
                viewMode={true}
                options={{
                    main_program_id: mainProgramsData?.data,
                    status: enabledDisabledOptions
                }}
            />
        </Modal>
    );
}
