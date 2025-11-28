import React from 'react';
import FormExamSegmentsCount from './FormExamSegmentsCount';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function ViewExamSegmentsCount({ onClose, oldData }) {
    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="exam_segments_count.view" />
            <FormExamSegmentsCount
                onClose={onClose}
                oldData={oldData}
                viewMode={true}
                mutate={() => {}}
                isPending={false}
                options={{
                    is_active: enabledDisabledOptions
                }}
            />
        </Modal>
    );
}