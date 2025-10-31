import Cell from '@/components/common/table/cells/Cell';
import ActiveCell from '@/components/common/table/cells/ActiveCell';
import DateCell from '@/components/common/table/cells/DateCell';
import NameCell from '@/components/common/table/cells/NameCell';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';

const columnHelper = createColumnHelper();

export const teachersColumns = [
    columnHelper.accessor('name', {
        header: 'table_headers.name',
        cell: info => <NameCell directValue={info.row.original.name} />
    }),
    columnHelper.accessor('email', {
        header: 'table_headers.email',
        cell: info => <Cell value={info.getValue()} />
    }),
    columnHelper.accessor('phone', {
        header: 'table_headers.phone',
        cell: info => <Cell value={info.getValue()} />
    }),
    columnHelper.accessor('licence_number', {
        header: 'table_headers.licence_number',
        cell: info => <Cell value={info.getValue()} />
    }),

    columnHelper.accessor('main_program', {
        header: 'table_headers.main_program',
        cell: info => <Cell value={info.row.original.main_program} />
    }),
    columnHelper.accessor('status', {
        header: 'table_headers.status',
        cell: info => <ActiveCell info={info} />
    }),
    columnHelper.accessor('created_at', {
        header: 'table_headers.created_at',
        cell: info => <DateCell fullDate value={info.getValue()} />,
        enableColumnFilter: false
    })
];

export const teachersFields = [
    {
        name: 'name.en',
        label: 'validation.name.label.en',
        type: 'text',
        placeholder: 'validation.name.placeholder.en',
        editMode: true,
        viewMode: true
    },
    {
        name: 'name.ar',
        label: 'validation.name.label.ar',
        type: 'text',
        placeholder: 'validation.name.placeholder.ar',
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
        info: 'info.branch_id',
        editMode: true,
        viewMode: true
    },
    {
        name: 'entity_id',
        label: 'validation.entity_id.label',
        type: 'select',
        placeholder: 'validation.entity_id.placeholder',
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
        name: 'program_entity_types',
        label: 'validation.program_entity_types.label',
        type: 'select',
        placeholder: 'validation.program_entity_types.placeholder',
        info: 'info.entity_type',
        editMode: true,
        viewMode: true
    },
    {
        name: 'entity_category_id',
        label: 'validation.entity_category_id.label',
        type: 'select',
        placeholder: 'validation.entity_category_id.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'licence_number',
        label: 'validation.licence_number.label',
        type: 'text',
        placeholder: 'validation.licence_number.placeholder',
        editMode: true,
        viewMode: true
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
        name: 'specification_id',
        label: 'validation.specification_id.label',
        type: 'select',
        placeholder: 'validation.specification_id.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'dob',
        label: 'validation.dob.label',
        type: 'date',
        placeholder: 'validation.dob.placeholder',
        editMode: true,
        viewMode: true
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
        name: 'national_id',
        label: 'validation.national_id.label',
        type: 'text',
        placeholder: 'validation.national_id.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'phone',
        label: 'validation.phone.label',
        type: 'text',
        placeholder: 'validation.phone.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'email',
        label: 'validation.email.label',
        type: 'email',
        placeholder: 'validation.email.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'address',
        label: 'validation.address.label',
        type: 'textarea',
        placeholder: 'validation.address.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'profile_image',
        label: 'validation.profile_image.label',
        type: 'file',
        placeholder: 'validation.profile_image.placeholder',
        editMode: true,
        viewMode: true,
        accept: 'image/*'
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

export const teachersDefaultValues = {
    status: true,
    name: {
        en: '',
        ar: ''
    }
};

export const teachersFilters = [
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
        defaultValue: 1
    }
];

export const filtersDefaultValues = {
    status: true,
    search: ''
};
