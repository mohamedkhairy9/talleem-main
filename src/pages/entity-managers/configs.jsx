import Cell from '@/components/common/table/cells/Cell';
import DateCell from '@/components/common/table/cells/DateCell';
import NameCell from '@/components/common/table/cells/NameCell';
import { getMaxDateForMinAge } from '@/utils/helpers/dateHelpers';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';

const columnHelper = createColumnHelper();

export const entityManagersColumns = [
    columnHelper.accessor('name', {
        header: 'table_headers.name',
        cell: info => <NameCell directValue={info.row.original.name} />
    }),
    columnHelper.accessor('manager_email', {
        header: 'table_headers.email',
        cell: info => <Cell value={info.getValue()} />
    }),
    columnHelper.accessor('manager_phone', {
        header: 'table_headers.phone',
        cell: info => <Cell value={info.getValue()} />
    }),
    columnHelper.accessor('national_id', {
        header: 'table_headers.national_id',
        cell: info => <Cell value={info.getValue()} />
    }),
    columnHelper.accessor('gender', {
        header: 'table_headers.gender',
        cell: info => {
            const gender = info.getValue();
            return (
                <span className="capitalize">
                    {gender === 'male' ? 'Male' : 'Female'}
                </span>
            );
        }
    }),
    columnHelper.accessor('entity', {
        header: 'table_headers.entity',
        cell: info => <Cell value={info.row.original.entity} />
    }),
    columnHelper.accessor('created_at', {
        header: 'table_headers.created_at',
        cell: info => <DateCell fullDate value={info.getValue()} />,
        enableColumnFilter: false
    })
];

export const entityManagersFields = [
    // Right Column - Primary Information
    {
        name: 'name.ar',
        label: 'validation.name.label.ar',
        type: 'text',
        placeholder: 'validation.name.placeholder.ar',
        editMode: true,
        viewMode: true
    },
    {
        name: 'name.en',
        label: 'validation.name.label.en',
        type: 'text',
        placeholder: 'validation.name.placeholder.en',
        editMode: true,
        viewMode: true
    },
    {
        name: 'main_program_id',
        label: 'validation.main_program_id.label',
        type: 'select',
        placeholder: 'validation.main_program_id.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'city_id',
        label: 'validation.city_id.label',
        type: 'select',
        placeholder: 'validation.city_id.placeholder',
        editMode: true,
        viewMode: true
    },

    {
        name: 'branch_id',
        label: 'validation.branch_id.label',
        type: 'select',
        placeholder: 'validation.branch_id.placeholder',
        editMode: true,
        viewMode: true,
    },
    {
        name: 'entity_ids',
        label: 'validation.entity_ids.label',
        type: 'select',
        placeholder: 'validation.entity_ids.placeholder',
        editMode: true,
        viewMode: true,
        info: 'info.entity',
        isMulti: true
    },
    {
        name: 'nationality_id',
        label: 'validation.nationality_id.label',
        type: 'select',
        placeholder: 'validation.nationality_id.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'academic_qualification_id',
        label: 'validation.academic_qualification_id.label',
        type: 'select',
        placeholder: 'validation.academic_qualification_id.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'major_id',
        label: 'validation.major_id.label',
        type: 'select',
        placeholder: 'validation.major_id.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'date_of_birth',
        label: 'validation.date_of_birth.label',
        type: 'date',
        placeholder: 'validation.date_of_birth.placeholder',
        editMode: true,
        viewMode: true,
        max: getMaxDateForMinAge(18),
        min: getMaxDateForMinAge(90)
    },
    {
        name: 'years_of_experience',
        label: 'validation.years_of_experience.label',
        type: 'number',
        placeholder: 'validation.years_of_experience.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'memorization_amount',
        label: 'validation.memorization_amount.label',
        type: 'text',
        placeholder: 'validation.memorization_amount.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'status',
        label: 'validation.status.label',
        type: 'select',
        placeholder: 'validation.status.placeholder',
        defaultValue: 'active',
        editMode: true,
        viewMode: true
    },
    // Left Column - Additional Information
    {
        name: 'profile_image',
        label: 'validation.profile_picture.label',
        type: 'file',
        placeholder: 'validation.profile_image.placeholder',
        editMode: true,
        viewMode: true,
        accept: 'image/*'
    },
    {
        name: 'national_id',
        label: 'validation.national_id.label',
        type: 'text',
        placeholder: 'validation.national_id.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'gender',
        label: 'validation.gender.label',
        type: 'select',
        placeholder: 'validation.gender.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'manager_phone',
        label: 'validation.manager_phone.label',
        type: 'text',
        placeholder: 'validation.manager_phone.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'manager_email',
        label: 'validation.manager_email.label',
        type: 'email',
        placeholder: 'validation.manager_email.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'address',
        label: 'validation.entity_manager_address.label',
        type: 'textarea',
        placeholder: 'validation.entity_manager_address.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'files',
        label: 'validation.fles.label',
        type: 'file',
        placeholder: 'validation.fles.placeholder',
        editMode: true,
        viewMode: true,
        multiple: true
    }
];

export const entityManagersDefaultValues = {
    status: true,
    name: {
        en: '',
        ar: ''
    },
    entity_ids: []
};

export const entityManagersFilters = [
    {
        name: 'search',
        type: 'text',
        placeholder: 'validation.search.placeholder',
        defaultValue: ''
    },
    {
        name: 'status',
        type: 'select',
        placeholder: 'validation.status.placeholder',
        defaultValue: true
    }
];

export const filtersDefaultValues = {
    status: true,
    search: ''
};
