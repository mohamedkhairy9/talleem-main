import { useUpdateCertificateNameMutation } from '@/api/hooks/useCertificateNames';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import React from 'react';
import FormCertificateName from './FormCertificateName';
import { enabledDisabledOptions } from '@/utils/constants/options';
import Loader from '@/components/common/Loader';
import useApiCalls from './useApiCalls';
import { apiCalls } from './configs';

export default function EditCertificateName({ onClose, oldData }) {
    console.log('oldData', oldData);

    const { mutate, isPending } = useUpdateCertificateNameMutation();

    const { mainProgramsData, isLoading } = useApiCalls({ apiCalls });

    if (isLoading) return <Loader />;

    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="certificate_names.update" />
            <FormCertificateName
                oldData={oldData}
                mutate={mutate}
                isPending={isPending}
                onClose={onClose}
                editMode={true}
                options={{
                    main_program_id: mainProgramsData?.data,
                    status: enabledDisabledOptions
                }}
            />
        </Modal>
    );
}
