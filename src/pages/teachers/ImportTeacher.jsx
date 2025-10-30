import React from 'react';
import { useImportTeachersMutation } from '@/api/hooks/useTeachers';
import ImportForm from '@/components/common/UIs/ImportForm';

export default function ImportTeacher({ onClose }) {
    const { mutate, isPending } = useImportTeachersMutation();

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

