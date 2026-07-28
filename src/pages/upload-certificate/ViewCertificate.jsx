import React from 'react';
import FormCertificate from './FormCertificate';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { apiCalls } from './configs';
import Loader from '@/components/common/Loader';
import useApiCalls from './useApiCalls';
import { useCertificateQuery } from '@/api/hooks/useCertificates';

export default function ViewCertificate({ onClose, oldData }) {
    const {
        mainProgramsData,
        branchesData,
        isLoading
    } = useApiCalls({ apiCalls });
    const { data: certificateResponse, isLoading: isCertificateLoading } =
        useCertificateQuery(oldData?.id, { enabled: Boolean(oldData?.id) });
    const certificate = certificateResponse?.data ?? certificateResponse ?? oldData;
    const certificateData = {
        ...oldData,
        ...certificate,
        main_program_id:
            certificate?.main_program_id ?? certificate?.student?.main_program_id ?? oldData?.main_program_id,
        branch_id:
            certificate?.branch_id ?? certificate?.student?.branch?.id ?? oldData?.branch_id,
        entity_id:
            certificate?.entity_id ?? certificate?.student?.primary_entity_id ?? oldData?.entity_id,
        student_id: certificate?.student_id ?? certificate?.student?.id ?? oldData?.student_id,
        certificate_name_id:
            certificate?.certificate_name_id ?? oldData?.certificate_name_id,
        file: certificate?.image_url ?? oldData?.file
    };

    if (isLoading || isCertificateLoading) return <Loader />;

    return (
        <Modal onClose={onClose} size="3xl">
            <ModalHeader onClose={onClose} header="certificates.view" />
            <FormCertificate
                onClose={onClose}
                oldData={certificateData}
                viewMode={true}
                mutate={() => {}}
                isPending={false}
                options={{
                    main_program_id: mainProgramsData?.data,
                    branch_id: branchesData?.data
                }}
                issuedFrom={certificateData.issued_from_value}
            />
        </Modal>
    );
}
