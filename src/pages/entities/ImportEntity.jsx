import React from 'react';
import { useImportEntitiesMutation } from '@/api/hooks/useEntities';
import ImportForm from '@/components/common/UIs/ImportForm';

export default function ImportEntity({ onClose }) {
    const { mutate, isPending } = useImportEntitiesMutation();

    return (
        <ImportForm onClose={onClose} isPending={isPending} mutate={mutate} />
    );
}
