import Cell from '@/components/common/table/cells/Cell';
import DateCell from '@/components/common/table/cells/DateCell';
import NameCell from '@/components/common/table/cells/NameCell';
import { enabledDisabledOptions } from '@/utils/constants/options';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';
import { getMaxDateForMinAge } from '@/utils/helpers/dateHelpers';

const columnHelper = createColumnHelper();

export const employeesColumns = [
    columnHelper.accessor('name', {
        header: 'table_headers.employee',
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
    columnHelper.accessor('national_id', {
        header: 'table_headers.national_id',
        cell: info => <Cell value={info.getValue()} />
    }),
    columnHelper.accessor('job', {
        header: 'table_headers.job',
        cell: info => <NameCell directValue={info.row.original.job?.name} />
    }),
    columnHelper.accessor('branch', {
        header: 'table_headers.branch',
        cell: info => <NameCell directValue={info.row.original.branch?.name} />
    }),
    columnHelper.accessor('created_at', {
        header: 'table_headers.created_at',
        cell: info => <DateCell fullDate value={info.getValue()} />,
        enableColumnFilter: false
    })
];

export const employeesFields = [
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
        name: 'national_id',
        label: 'validation.national_id.label',
        type: 'text',
        placeholder: 'validation.national_id.placeholder',
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
        max: getMaxDateForMinAge(18)
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
        viewMode: true,
        isMulti: true
    },
    {
        name: 'entity_id',
        label: 'validation.entity_id.label',
        type: 'select',
        placeholder: 'validation.entity_id.placeholder',
        editMode: true,
        viewMode: true,
        isMulti: true
    },
    {
        name: 'job_id',
        label: 'validation.job_id.label',
        type: 'select',
        placeholder: 'validation.job_id.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'roles',
        label: 'validation.roles.label',
        type: 'select',
        placeholder: 'validation.roles.placeholder',
        editMode: true,
        viewMode: true,
        isMulti: true
    },
    {
        name: 'academic_qualification_id',
        label: 'validation.academic_qualification_id.label',
        type: 'select',
        placeholder: 'validation.academic_qualification_id.placeholder',
        editMode: true,
        viewMode: true
    },
    // {
    //     name: 'specification_id',
    //     label: 'validation.specification_id.label',
    //     type: 'select',
    //     placeholder: 'validation.specification_id.placeholder',
    //     editMode: true,
    //     viewMode: true
    // },
    {
        name: 'major_id',
        label: 'validation.major_id.label',
        type: 'select',
        placeholder: 'validation.major_id.placeholder',
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
        name: 'address',
        label: 'validation.address.label',
        type: 'textarea',
        placeholder: 'validation.address.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'status',
        label: 'validation.status.label',
        type: 'select',
        placeholder: 'validation.status.placeholder',
        defaultValue: true,
        options: enabledDisabledOptions,
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
    },
    {
        name: 'profile_picture',
        label: 'validation.profile_picture.label',
        type: 'file',
        placeholder: 'validation.profile_image.placeholder',
        editMode: true,
        viewMode: true,
        accept: 'image/*'
    }
];

export const employeesDefaultValues = {
    status: true
};

export const employeesFilters = [
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
