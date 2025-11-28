import React from 'react';
import FormEntityActivity from './FormEntityActivity';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useCreateEntityActivityMutation } from '@/api/hooks/useEntityActivities';
import { apiCalls, entityActivitiesDefaultValues } from './configs';
import Loader from '@/components/common/Loader';
import useApiCalls from './useApiCalls';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function CreateEntityActivity({ onClose }) {
    const { mutate, isPending } = useCreateEntityActivityMutation();

    const { entitiesData, activitiesData, isLoading } = useApiCalls({
        apiCalls
    });

    if (isLoading) return <Loader />;

    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="entity_activities.create" />
            <FormEntityActivity
                mutate={mutate}
                isPending={isPending}
                onClose={onClose}
                options={{
                    entity_id: entitiesData?.data,
                    activity_id: activitiesData?.data,
                    status: enabledDisabledOptions
                }}
                oldData={entityActivitiesDefaultValues}
            />
        </Modal>
    );
}
