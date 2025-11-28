import { useUpdateNeighborhoodMutation } from '@/api/hooks/useNeighborhoods';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import React from 'react';
import FormNeighborhood from './FormNeighborhood';
import { useCitiesQuery } from '@/api/hooks/useCities';
import Loader from '@/components/common/Loader';
import { allData } from '@/utils/constants/global.constants';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function EditNeighborhood({ onClose, oldData }) {
    console.log("old data: ", oldData)
    const { data: citiesData, isLoading } = useCitiesQuery(allData);
    const { mutate, isPending } = useUpdateNeighborhoodMutation();
    if (isLoading) return <Loader />;
    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="neighborhoods.update" />
            <FormNeighborhood
                oldData={oldData}
                mutate={mutate}
                isPending={isPending}
                onClose={onClose}
                editMode={true}
                options={{
                    city_id: citiesData?.data,
                    status: enabledDisabledOptions
                }}
            />
        </Modal>
    );
}
