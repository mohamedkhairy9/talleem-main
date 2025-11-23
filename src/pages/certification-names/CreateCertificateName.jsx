import React from 'react';
import FormCertificateName from './FormCertificateName';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useCreateCertificateNameMutation } from '@/api/hooks/useCertificateNames';
import { apiCalls, certificateNamesDefaultValues } from './configs';
import Loader from '@/components/common/Loader';
import useApiCalls from './useApiCalls';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function CreateCertificateName({ onClose }) {
    const { mutate, isPending } = useCreateCertificateNameMutation();

    const { mainProgramsData, isLoading } = useApiCalls({ apiCalls });

    if (isLoading) return <Loader />;

    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="certificate_names.create" />
            <FormCertificateName
                mutate={mutate}
                isPending={isPending}
                onClose={onClose}
                options={{
                    main_program_id: mainProgramsData?.data,
                    status: enabledDisabledOptions
                }}
                oldData={certificateNamesDefaultValues}
            />
        </Modal>
    );
}
