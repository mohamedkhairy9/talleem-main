import React from 'react';
import FormNeighborhood from './FormNeighborhood';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useCreateNeighborhoodMutation } from '@/api/hooks/useNeighborhoods';
import { useCitiesQuery } from '@/api/hooks/useCities';
import Loader from '@/components/common/Loader';
import { allData } from '@/utils/constants/global.constants';

export default function CreateNeighborhood({ onClose }) {
    const { mutate, isPending } = useCreateNeighborhoodMutation();
    const { data: citiesData, isLoading } = useCitiesQuery(allData);

    if (isLoading) return <Loader />;
    return (
        <Modal onClose={onClose}>
            <ModalHeader onClose={onClose} header="neighborhoods.create" />
            <FormNeighborhood
                mutate={mutate}
                isPending={isPending}
                onClose={onClose}
                options={{ city_id: citiesData?.data }}
            />
        </Modal>
    );
}
