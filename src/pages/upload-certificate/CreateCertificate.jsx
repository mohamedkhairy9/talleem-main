import React from 'react';
import FormCertificate from './FormCertificate';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useCreateCertificateMutation } from '@/api/hooks/useCertificates';
import { apiCalls, certificatesDefaultValues } from './configs';
import Loader from '@/components/common/Loader';
import useApiCalls from './useApiCalls';
import { useUserStore } from '@/utils/stores/user.store';
import { getBranchManagerAssignedBranchId } from '@/utils/helpers/branchManagerScope';

export default function CreateCertificate({ onClose }) {
    const { mutate, isPending } = useCreateCertificateMutation();
    const currentUser = useUserStore(state => state.user);
    const assignedBranchId = getBranchManagerAssignedBranchId(currentUser);

    const {
        mainProgramsData,
        branchesData,
        isLoading
    } = useApiCalls({ apiCalls });

    if (isLoading) return <Loader />;

    return (
        <Modal onClose={onClose} size="3xl">
            <ModalHeader onClose={onClose} header="certificates.create" />
            <FormCertificate
                onClose={onClose}
                oldData={{
                    ...certificatesDefaultValues,
                    branch_id: assignedBranchId || ''
                }}
                mutate={mutate}
                isPending={isPending}
                options={{
                    main_program_id: mainProgramsData?.data,
                    branch_id: assignedBranchId
                        ? (branchesData?.data || []).filter(
                              branch => String(branch.id) === String(assignedBranchId)
                          )
                        : branchesData?.data
                }}
                assignedBranchId={assignedBranchId}
            />
        </Modal>
    );
}
