import { API_KEYS } from '@/api/endpoints';
import Cell from '@/components/common/table/cells/Cell';
import DateCell from '@/components/common/table/cells/DateCell';
import NameCell from '@/components/common/table/cells/NameCell';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';

const columnHelper = createColumnHelper();

export const entitiesColumns = [
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
    columnHelper.accessor('branch', {
        header: 'table_headers.branch',
        cell: info => <Cell value={info.row.original.branch?.name} />
    }),
    columnHelper.accessor('main_program', {
        header: 'table_headers.main_program',
        cell: info => <Cell value={info.row.original.main_program?.name} />
    }),
    columnHelper.accessor('created_at', {
        header: 'table_headers.created_at',
        cell: info => <DateCell fullDate value={info.getValue()} />,
        enableColumnFilter: false
    })
];

export const entitiesFields = [
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
        name: 'neighborhood_id',
        label: 'validation.neighborhood_id.label',
        type: 'select',
        placeholder: 'validation.neighborhood_id.placeholder',
        editMode: true,
        viewMode: true,
        info: 'info.neighborhood_id'
    },
    {
        name: 'branch_id',
        label: 'validation.branch_id.label',
        type: 'select',
        placeholder: 'validation.branch_id.placeholder',
        editMode: true,
        viewMode: true,
        info: 'info.branch_id'
    },
    {
        name: 'main_program_id',
        label: 'validation.main_program_id.label',
        type: 'select',
        placeholder: 'validation.main_program_id.placeholder',
        editMode: true,
        viewMode: true,
        
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
        name: 'location_type_id',
        label: 'validation.location_type_id.label',
        type: 'select',
        placeholder: 'validation.location_type_id.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'entity_type',
        label: 'validation.entity_type.label',
        type: 'select',
        placeholder: 'validation.entity_type.placeholder',
        editMode: true,
        viewMode: true,
        info: 'info.entity_type'
    },
    {
        name: 'min_acceptance_age',
        label: 'validation.min_acceptance_age.label',
        type: 'number',
        placeholder: 'validation.min_acceptance_age.placeholder',
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
        name: 'area',
        label: 'validation.area.label',
        type: 'text',
        placeholder: 'validation.area.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'class_count',
        label: 'validation.class_count.label',
        type: 'number',
        placeholder: 'validation.class_count.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'management_rooms_count',
        label: 'validation.management_rooms_count.label',
        type: 'number',
        placeholder: 'validation.management_rooms_count.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'lecture_holes_count',
        label: 'validation.lecture_holes_count.label',
        type: 'number',
        placeholder: 'validation.lecture_holes_count.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'activity_ids',
        label: 'validation.activity_ids.label',
        type: 'select',
        placeholder: 'validation.activity_ids.placeholder',
        editMode: true,
        viewMode: true,
        isMulti: true
    },
    {
        name: 'files',
        label: 'validation.files.label',
        type: 'file',
        placeholder: 'validation.files.placeholder',
        editMode: true,
        viewMode: true,
        multiple: true
    }
];

export const entitiesDefaultValues = {
    status: 'active',
    name: {
        en: '',
        ar: ''
    },
    activities: [],
    class_count: 0,
    management_rooms_count: 0,
    lecture_holes_count: 0,
    min_acceptance_age: 1
};

export const entitiesFilters = [
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
        defaultValue: 'active'
    }
];

export const filtersDefaultValues = {
    status: 'active',
    search: ''
};

export const apiCalls = [
    API_KEYS.BRANCHES,
    API_KEYS.MAIN_PROGRAMS,
    API_KEYS.ENTITY_CATEGORIES,
    API_KEYS.EDUCATION_PROGRAM_ENTITY_TYPES,
    API_KEYS.MEMORIZATION_PROGRAM_ENTITY_TYPES,
    API_KEYS.CITIES,
    API_KEYS.NEIGHBORHOODS,
    API_KEYS.LOCATION_TYPES,
    API_KEYS.USERS,
    API_KEYS.ACTIVITIES
];
