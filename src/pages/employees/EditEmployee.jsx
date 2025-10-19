import React from 'react';
import FormEmployee from './FormEmployee';
import { useUpdateEmployeeMutation } from '@/api/hooks/useEmployees';
import useCustomQueries from '@/utils/hooks/global/useCustomQueries';

export default function EditEmployee({ onClose, oldData }) {
    const { mutate, isPending } = useUpdateEmployeeMutation();
    const { options } = useCustomQueries([
        'user_id',
        'job_id',
        'branch_id',
        'entity_id',
        'nationality_id',
        'academic_qualification_id',
        'specification_id',
        'city_id'
    ]);

    return (
        <FormEmployee
            onClose={onClose}
            oldData={oldData}
            editMode={true}
            mutate={mutate}
            isPending={isPending}
            options={options}
        />
    );
}

