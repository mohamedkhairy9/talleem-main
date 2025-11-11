import React from 'react';
import { useImportEntityManagersMutation } from '@/api/hooks/useEntityManagers';
import ImportForm from '@/components/common/UIs/ImportForm';

export default function ImportEntityMangers({ onClose }) {
    const { mutate, isPending } = useImportEntityManagersMutation();

    return (
        <ImportForm
            onClose={onClose}
            isPending={isPending}
            mutate={mutate}
            header="teachers.import"
            importInfo="teachers.import_info"
        />
    );
}

