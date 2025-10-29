import React from 'react';
import FormActivity from './FormActivity';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useCreateActivityMutation } from '@/api/hooks/useActivities';
import { enabledDisabledOptions } from '@/utils/constants/options';
import useApiCalls from './useApiCalls';
import Loader from '@/components/common/Loader';
import { API_KEYS } from '@/api/endpoints';

const calls = [API_KEYS.MAIN_PROGRAMS];

export default function CreateActivity({ onClose }) {
    const { mutate, isPending } = useCreateActivityMutation();

    const { mainProgramsData, isLoading } = useApiCalls({ calls });

    if (isLoading) return <Loader />;

    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="activities.create" />
            <FormActivity
                mutate={mutate}
                isPending={isPending}
                onClose={onClose}
                options={{
                    status: enabledDisabledOptions,
                    main_program_id: mainProgramsData?.data
                }}
                oldData={{ status: true }}
            />
        </Modal>
    );
}
