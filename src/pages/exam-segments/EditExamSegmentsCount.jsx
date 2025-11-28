import React from 'react';
import FormExamSegmentsCount from './FormExamSegmentsCount';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useUpdateExamSegmentsCountMutation } from '@/api/hooks/useExamSegmentsCount';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function EditExamSegmentsCount({ onClose, oldData }) {
    const { mutate, isPending } = useUpdateExamSegmentsCountMutation();

    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="exam_segments_count.edit" />
            <FormExamSegmentsCount
                onClose={onClose}
                oldData={oldData}
                editMode={true}
                mutate={mutate}
                isPending={isPending}
                options={{
                    is_active: enabledDisabledOptions
                }}
            />
        </Modal>
    );
}