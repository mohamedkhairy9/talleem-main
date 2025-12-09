import { useUpdateInspectorAssignmentMutation } from '@/api/hooks/useInspectorAssignments';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import React from 'react';
import { enabledDisabledOptions } from '@/utils/constants/options';
import Loader from '@/components/common/Loader';
import useApiCalls from './useApiCalls';
import { apiCalls } from './configs';
import FormInspectorAssignment from './Forminspectorassignment';
import ErrorBoundary from '@/components/common/ErrorBoundary';

export default function EditInspectorAssignment({ onClose, oldData }) {
    const { mutate, isPending } = useUpdateInspectorAssignmentMutation();

    const { branchesData, mainProgramsData, isLoading } = useApiCalls({
        apiCalls
    });

    // تحويل البيانات من API إلى الشكل المطلوب للنموذج
    // MUST be called before any early returns to maintain hooks order
    const transformedData = React.useMemo(() => {
        if (!oldData) return null;
        
        // استخراج IDs من المشرفين
        let supervisorIds;
        if (oldData.assignment_type === 'committee') {
            // للجنة: نريد array من الـ IDs
            supervisorIds = oldData.supervisors?.map(s => s.id) || [];
        } else {
            // للإشراف العادي: نريد ID واحد فقط
            supervisorIds = oldData.supervisors?.[0]?.id || '';
        }
        
        return {
            ...oldData,
            main_program_id: oldData.main_program?.id || '',
            branch_id: oldData.branch?.id || '',
            supervisor_ids: supervisorIds,
            supervisors: oldData.supervisors, // Preserve original supervisors array for form options
            entity_ids: oldData.entity_ids || [], // مؤقتاً حتى يرجع الـ backend
            status: oldData.is_active !== undefined ? oldData.is_active : oldData.status
        };
    }, [oldData]);

    if (isLoading) return <Loader />;

    const assignmentTypeOptions = [
        { id: 'regular', name: 'إشراف تربوي اعتيادي' },
        { id: 'committee', name: 'تشكيل لجنة إشراف' }
    ];

    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="inspector_assignments.update" />
            <ErrorBoundary>
                <FormInspectorAssignment
                    oldData={transformedData}
                    mutate={mutate}
                    isPending={isPending}
                    onClose={onClose}
                    editMode={true}
                    options={{
                        assignment_type: assignmentTypeOptions,
                        main_program_id: mainProgramsData?.data,
                        branch_id: branchesData?.data,
                        status: enabledDisabledOptions
                    }}
                />
            </ErrorBoundary>
        </Modal>
    );
}