import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import React from 'react';
import { enabledDisabledOptions } from '@/utils/constants/options';
import Loader from '@/components/common/Loader';
import useApiCalls from './useApiCalls';
import { apiCalls } from './configs';
import FormInspectorAssignment from './Forminspectorassignment';
import ErrorBoundary from '@/components/common/ErrorBoundary';

export default function ViewInspectorAssignment({ onClose, oldData }) {
    const { branchesData, entitiesData, usersData, mainProgramsData, isLoading } = useApiCalls({
        apiCalls
    });

    if (isLoading) return <Loader />;

    // تحويل البيانات من API إلى الشكل المطلوب للنموذج
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
            entity_ids: oldData.entity_ids || [], // مؤقتاً حتى يرجع الـ backend
            status: oldData.is_active !== undefined ? oldData.is_active : oldData.status
        };
    }, [oldData]);

    const assignmentTypeOptions = [
        { id: 'regular', name: 'إشراف تربوي اعتيادي' },
        { id: 'committee', name: 'تشكيل لجنة إشراف' }
    ];

    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="inspector_assignments.view" />
            <ErrorBoundary>
                <FormInspectorAssignment
                    oldData={transformedData}
                    onClose={onClose}
                    editMode={false}
                    viewMode={true}
                    options={{
                        assignment_type: assignmentTypeOptions,
                        main_program_id: mainProgramsData?.data,
                        branch_id: branchesData?.data,
                        entity_ids: entitiesData?.data,
                        supervisor_ids: usersData?.data,
                        status: enabledDisabledOptions
                    }}
                />
            </ErrorBoundary>
        </Modal>
    );
}