import React from 'react';
import FormCertificate from './FormCertificate';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useUpdateCertificateMutation } from '@/api/hooks/useCertificates';
import { apiCalls } from './configs';
import Loader from '@/components/common/Loader';
import useApiCalls from './useApiCalls';
import { isSuperAdminUser } from '@/api/axiosInstance';
import { useCertificateQuery } from '@/api/hooks/useCertificates';

function getCertificateFormData(oldData, certificateResponse) {
    const certificate = certificateResponse?.data ?? certificateResponse ?? oldData;
    const student = certificate?.student ?? oldData?.student;
    const entity =
        certificate?.entity ??
        student?.entity ??
        student?.primary_entity ??
        student?.user?.entity;
    const mainProgram =
        certificate?.main_program ??
        student?.main_program ??
        entity?.main_program ??
        student?.user?.entity?.main_program;
    const branch =
        certificate?.branch ??
        student?.branch ??
        entity?.branch ??
        student?.user?.branch ??
        student?.user?.entity?.branch;

    return {
        ...oldData,
        ...certificate,
        student,
        entity,
        main_program: mainProgram,
        branch,
        main_program_id:
            certificate?.main_program_id ??
            mainProgram?.id ??
            student?.main_program_id ??
            entity?.main_program_id ??
            oldData?.main_program_id,
        branch_id:
            certificate?.branch_id ??
            branch?.id ??
            student?.branch_id ??
            entity?.branch_id ??
            oldData?.branch_id,
        entity_id:
            certificate?.entity_id ??
            entity?.id ??
            student?.primary_entity_id ??
            oldData?.entity_id,
        student_id: certificate?.student_id ?? student?.id ?? oldData?.student_id,
        certificate_name_id:
            certificate?.certificate_name_id ?? oldData?.certificate_name_id,
        file:
            certificate?.image_url ??
            certificate?.file_url ??
            certificate?.file ??
            certificate?.image ??
            oldData?.file
    };
}

export default function EditCertificate({ onClose, oldData }) {
    const { mutate, isPending } = useUpdateCertificateMutation();
    const { data: certificateResponse, isLoading: isCertificateLoading } =
        useCertificateQuery(oldData?.id, { enabled: Boolean(oldData?.id) });

    const {
        mainProgramsData,
        branchesData,
        isLoading
    } = useApiCalls({ apiCalls });

    if (isLoading || isCertificateLoading) return <Loader />;

    const certificateData = getCertificateFormData(oldData, certificateResponse);

    return (
        <Modal onClose={onClose} size="3xl">
            <ModalHeader onClose={onClose} header="certificates.edit" />
            <FormCertificate
                onClose={onClose}
                oldData={certificateData}
                editMode={true}
                mutate={mutate}
                isPending={isPending}
                options={{
                    main_program_id: mainProgramsData?.data,
                    branch_id: branchesData?.data
                }}
                issuedFrom={certificateData?.issued_from_value}
                allowAllCertificateNames={isSuperAdminUser()}
            />
        </Modal>
    );
}
