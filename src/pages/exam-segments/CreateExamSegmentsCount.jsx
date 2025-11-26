import React from 'react';
import FormExamSegmentsCount from './FormExamSegmentsCount';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useCreateExamSegmentsCountMutation } from '@/api/hooks/useExamSegmentsCount';
import { examSegmentsCountDefaultValues } from './configs';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function CreateExamSegmentsCount({ onClose }) {
    const { mutate, isPending } = useCreateExamSegmentsCountMutation();

    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="exam_segments_count.create" />
            <FormExamSegmentsCount
                onClose={onClose}
                oldData={examSegmentsCountDefaultValues}
                mutate={mutate}
                isPending={isPending}
                options={{
                    is_active: enabledDisabledOptions
                }}
            />
        </Modal>
    );
}