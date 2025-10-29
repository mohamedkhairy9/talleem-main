import { useUpdateEntityActivityMutation } from '@/api/hooks/useEntityActivities';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import React from 'react';
import FormEntityActivity from './FormEntityActivity';
import { enabledDisabledOptions } from '@/utils/constants/options';
import Loader from '@/components/common/Loader';
import useApiCalls from './useApiCalls';
import { apiCalls } from './configs';

export default function EditEntityActivity({ onClose, oldData }) {
    console.log('oldData', oldData);

    const { mutate, isPending } = useUpdateEntityActivityMutation();

    const { entitiesData, activitiesData, isLoading } = useApiCalls({
        apiCalls
    });

    if (isLoading) return <Loader />;

    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="entity_activities.update" />
            <FormEntityActivity
                oldData={oldData}
                mutate={mutate}
                isPending={isPending}
                onClose={onClose}
                editMode={true}
                options={{
                    entity_id: entitiesData?.data,
                    activity_id: activitiesData?.data,
                    status: enabledDisabledOptions
                }}
            />
        </Modal>
    );
}
