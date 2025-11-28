import React from 'react';
import { useImportStudentsMutation } from '@/api/hooks/useStudents';
import ImportForm from '@/components/common/UIs/ImportForm';

export default function ImportStudent({ onClose }) {
    const { mutate, isPending } = useImportStudentsMutation();

    return (
        <ImportForm
            onClose={onClose}
            isPending={isPending}
            mutate={mutate}
            header="students.import"
            importInfo="students.import_info"
        />
    );
}

