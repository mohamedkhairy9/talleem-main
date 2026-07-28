import React from 'react';
import FormCertificate from './FormCertificate';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { apiCalls } from './configs';
import Loader from '@/components/common/Loader';
import useApiCalls from './useApiCalls';
import { useCertificateQuery } from '@/api/hooks/useCertificates';

const localizedName = value => {
    if (!value) return '';
    if (typeof value === 'string') return value;

    return value?.name?.ar || value?.name?.en || value?.ar || value?.en || value?.name || '';
};

const selectOption = (item, fallbackId, fallbackLabel) => {
    const id = item?.id ?? fallbackId;
    const label = localizedName(item) || fallbackLabel;

    return id != null && id !== '' && label
        ? { id, value: id, label, name: item?.name }
        : null;
};

export default function ViewCertificate({ onClose, oldData }) {
    const {
        mainProgramsData,
        branchesData,
        isLoading
    } = useApiCalls({ apiCalls });
    const { data: certificateResponse, isLoading: isCertificateLoading } =
        useCertificateQuery(oldData?.id, { enabled: Boolean(oldData?.id) });
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
    const certificateName = certificate?.certificate_name ?? oldData?.certificate_name;

    const certificateData = {
        ...oldData,
        ...certificate,
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
        certificate_name: certificateName,
        file:
            certificate?.image_url ??
            certificate?.file_url ??
            certificate?.file ??
            certificate?.image ??
            oldData?.file
    };

    const viewOptions = {
        main_program_id: [
            selectOption(mainProgram, certificateData.main_program_id, localizedName(mainProgram))
        ].filter(Boolean),
        branch_id: [
            selectOption(branch, certificateData.branch_id, localizedName(branch))
        ].filter(Boolean),
        entity_id: [
            selectOption(entity, certificateData.entity_id, localizedName(entity))
        ].filter(Boolean),
        student_id: [
            selectOption(student, certificateData.student_id, localizedName(student))
        ].filter(Boolean),
        certificate_name_id: [
            selectOption(
                typeof certificateName === 'object' ? certificateName : null,
                certificateData.certificate_name_id,
                localizedName(certificateName)
            )
        ].filter(Boolean)
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
                options={viewOptions}
                issuedFrom={certificateData.issued_from_value}
            />
        </Modal>
    );
}
