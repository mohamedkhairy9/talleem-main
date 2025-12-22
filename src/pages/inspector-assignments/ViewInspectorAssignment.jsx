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
        
        // Extract entity_ids from supervisors.entities
        const entityIds = oldData.supervisors?.flatMap(s => s.entities?.map(e => e.id) || []) || [];
        
        // Extract all entities from supervisors to include in form options
        const allEntities = oldData.supervisors?.flatMap(s => s.entities || []) || [];
        
        return {
            ...oldData,
            main_program_id: oldData.main_program?.id || '',
            branch_id: oldData.branch?.id || '',
            supervisor_ids: supervisorIds,
            supervisors: oldData.supervisors, // Preserve original supervisors array for form options
            entity_ids: entityIds.length > 0 ? entityIds : (oldData.entity_ids || []),
            entities: allEntities, // Include entities from response for form options
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
                        status: enabledDisabledOptions
                    }}
                />
            </ErrorBoundary>
        </Modal>
    );
}