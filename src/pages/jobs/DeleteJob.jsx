import { useDeleteJobMutation } from '@/api/hooks/useJobs';
import { employeesService } from '@/api/services/employees.service';
import DeleteModal from '@/components/common/form/DeleteModal';
import useLocale from '@/utils/hooks/global/useLocale';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

export default function DeleteJob({ onClose, id }) {
    const { mutate, isPending } = useDeleteJobMutation();
    const { t } = useLocale();
    const [isCheckingReferences, setIsCheckingReferences] = useState(false);

    const getEmployeesCount = response => {
        const total = response?.meta?.total ?? response?.total;

        if (total !== null && total !== undefined && Number.isFinite(Number(total))) {
            return Number(total);
        }

        return Array.isArray(response?.data) ? response.data.length : 0;
    };

    async function handleDelete() {
        setIsCheckingReferences(true);

        try {
            // The employees endpoint defaults to active employees, so check both
            // active and inactive records before allowing a job to be deleted.
            const baseParams = { job_id: id, page: 1, per_page: 1 };
            const [activeEmployees, inactiveEmployees] = await Promise.all([
                employeesService.getEmployees({ ...baseParams, status: true }),
                employeesService.getEmployees({ ...baseParams, status: false })
            ]);

            const hasAssignedEmployees =
                getEmployeesCount(activeEmployees) +
                    getEmployeesCount(inactiveEmployees) >
                0;

            if (hasAssignedEmployees) {
                toast.error(t('jobs.delete_blocked_by_employees'));
                return;
            }

            mutate(id, {
                onSuccess: () => {
                    onClose();
                }
            });
        } catch {
            // If we cannot verify references, do not risk deleting a linked job.
            toast.error(t('jobs.delete_reference_check_failed'));
        } finally {
            setIsCheckingReferences(false);
        }
    }

    return (
        <DeleteModal
            deleteFn={handleDelete}
            loading={isCheckingReferences || isPending}
            onClose={onClose}
        ></DeleteModal>
    );
}
