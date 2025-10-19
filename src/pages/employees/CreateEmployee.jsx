import React from 'react';
import FormEmployee from './FormEmployee';
import { useCreateEmployeeMutation } from '@/api/hooks/useEmployees';
import { employeesDefaultValues } from './configs';
import useCustomQueries from '@/utils/hooks/global/useCustomQueries';

export default function CreateEmployee({ onClose }) {
    const { mutate, isPending } = useCreateEmployeeMutation();
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
            oldData={employeesDefaultValues}
            mutate={mutate}
            isPending={isPending}
            options={options}
        />
    );
}

