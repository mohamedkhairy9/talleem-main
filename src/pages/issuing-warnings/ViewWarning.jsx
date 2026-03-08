import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import React, { useMemo } from 'react';
import FormWarning from './FormWarning';
import { enabledDisabledOptions } from '@/utils/constants/options';
import { normalizeWarningRowData } from './warningFormHelpers';

const warningTypeOptions = [
    { id: 'student', name: 'إنذار طالب' },
    { id: 'teacher', name: 'إنذار معلم' },
    { id: 'entity', name: 'إنذار جهة' }
];

/**
 * Build view form options from the row data only (no API calls).
 * Each select gets a single option from the nested object when present.
 */
function buildOptionsFromRow(row) {
    if (!row) {
        return {
            warning_type: warningTypeOptions,
            status: enabledDisabledOptions,
            program_id: [],
            branch_id: [],
            entity_id: [],
            student_id: [],
            teacher_id: [],
            warning_reason_id: []
        };
    }
    return {
        warning_type: warningTypeOptions,
        status: enabledDisabledOptions,
        program_id: row.program ? [row.program] : [],
        branch_id: row.branch ? [row.branch] : [],
        entity_id: row.entity ? [row.entity] : [],
        student_id: row.student ? [row.student] : [],
        teacher_id: row.teacher ? [row.teacher] : [],
        warning_reason_id: row.warning_reason ? [row.warning_reason] : []
    };
}

export default function ViewWarning({ onClose, oldData }) {
    const normalizedOldData = useMemo(() => normalizeWarningRowData(oldData), [oldData]);
    const options = useMemo(() => buildOptionsFromRow(normalizedOldData), [normalizedOldData]);

    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="warnings.view" />
            <FormWarning
                oldData={normalizedOldData}
                onClose={onClose}
                editMode={false}
                viewMode={true}
                options={options}
            />
        </Modal>
    );
}
