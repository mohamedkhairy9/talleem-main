import React from 'react';
import { useImportEmployeesMutation } from '@/api/hooks/useEmployees';
import ImportForm from '@/components/common/UIs/ImportForm';

export default function ImportEmployee({ onClose }) {
    const { mutate, isPending } = useImportEmployeesMutation();

    return (
        <ImportForm
            onClose={onClose}
            isPending={isPending}
            mutate={mutate}
            header="employees.import"
            importInfo="employees.import_info"
        />
    );
}


