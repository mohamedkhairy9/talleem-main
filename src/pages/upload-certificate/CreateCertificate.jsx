import React from 'react';
import FormCertificate from './FormCertificate';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import {
    useCertificateFormContextQuery,
    useCreateCertificateMutation
} from '@/api/hooks/useCertificates';
import { apiCalls, certificatesDefaultValues } from './configs';
import Loader from '@/components/common/Loader';
import useApiCalls from './useApiCalls';
import { useUserStore } from '@/utils/stores/user.store';
import { getBranchManagerAssignedBranchId } from '@/utils/helpers/branchManagerScope';
import { isGeneralManagerUser, isSuperAdminUser } from '@/api/axiosInstance';

function getFallbackIssuedFrom(currentUser) {
    if (isSuperAdminUser() || isGeneralManagerUser()) {
        return 'high management';
    }

    if (currentUser?.roles?.some(role =>
        String(role?.name ?? role).trim().toLowerCase() === 'branch manager'
    )) {
        return 'branch management';
    }

    return '';
}

export default function CreateCertificate({ onClose }) {
    const { mutate, isPending } = useCreateCertificateMutation();
    const { data: formContextData, isLoading: isLoadingFormContext } =
        useCertificateFormContextQuery();
    const currentUser = useUserStore(state => state.user);
    const formContext = formContextData?.data ?? formContextData;
    const issuedFrom = formContext?.issued_from || getFallbackIssuedFrom(currentUser);
    const assignedBranchId =
        (formContext?.branch_locked ? formContext?.branch?.id : null) ||
        getBranchManagerAssignedBranchId(currentUser);

    const {
        mainProgramsData,
        branchesData,
        isLoading
    } = useApiCalls({ apiCalls });

    if (isLoading || isLoadingFormContext) return <Loader />;

    return (
        <Modal onClose={onClose} size="3xl">
            <ModalHeader onClose={onClose} header="certificates.create" />
            <FormCertificate
                onClose={onClose}
                oldData={{
                    ...certificatesDefaultValues,
                    branch_id: assignedBranchId || '',
                    issued_from: issuedFrom
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
                issuedFrom={issuedFrom}
            />
        </Modal>
    );
}
