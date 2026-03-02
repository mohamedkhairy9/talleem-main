import React from 'react';
import FormCertificate from './FormCertificate';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useUpdateCertificateMutation } from '@/api/hooks/useCertificates';
import { apiCalls } from './configs';
import Loader from '@/components/common/Loader';
import useApiCalls from './useApiCalls';

export default function EditCertificate({ onClose, oldData }) {
    const { mutate, isPending } = useUpdateCertificateMutation();

    const {
        mainProgramsData,
        branchesData,
        certificateNamesData,
        isLoading
    } = useApiCalls({ apiCalls });

    if (isLoading) return <Loader />;

    return (
        <Modal onClose={onClose} size="3xl">
            <ModalHeader onClose={onClose} header="certificates.edit" />
            <FormCertificate
                onClose={onClose}
                oldData={oldData}
                editMode={true}
                mutate={mutate}
                isPending={isPending}
                options={{
                    main_program_id: mainProgramsData?.data,
                    branch_id: branchesData?.data,
                    certificate_name_id: certificateNamesData?.data
                }}
            />
        </Modal>
    );
}