import React from 'react';
import FormCertificate from './FormCertificate';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useCreateCertificateMutation } from '@/api/hooks/useCertificates';
import { apiCalls, certificatesDefaultValues } from './configs';
import Loader from '@/components/common/Loader';
import useApiCalls from './useApiCalls';

export default function CreateCertificate({ onClose }) {
    const { mutate, isPending } = useCreateCertificateMutation();

    const {
        mainProgramsData,
        branchesData,
        certificateNamesData,
        isLoading
    } = useApiCalls({ apiCalls });

    if (isLoading) return <Loader />;

    return (
        <Modal onClose={onClose} size="3xl">
            <ModalHeader onClose={onClose} header="certificates.create" />
            <FormCertificate
                onClose={onClose}
                oldData={certificatesDefaultValues}
                mutate={mutate}
                isPending={isPending}
                options={{
                    main_program_id: mainProgramsData?.data,
                    branch_id: branchesData?.data,
                    certificate_name_id: certificateNamesData?.data
                    // entity_id and student_id are fetched in the form by branch/program/entity
                }}
            />
        </Modal>
    );
}