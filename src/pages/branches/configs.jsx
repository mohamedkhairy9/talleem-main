import Cell from '@/components/common/table/cells/Cell';
import DateCell from '@/components/common/table/cells/DateCell';
import NameCell from '@/components/common/table/cells/NameCell';
import { enabledDisabledOptions } from '@/utils/constants/options';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';

const columnHelper = createColumnHelper();

export const branchesColumns = [
    columnHelper.accessor('name', {
        header: 'Branch',
        cell: info => <NameCell directValue={info.row.original.name} />
    }),
    // columnHelper.accessor('city', {
    //     header: 'City',
    //     cell: info => <NameCell directValue={info.row.original.city?.name} />
    // }),
    // columnHelper.accessor('neighborhood', {
    //     header: 'Neighborhood',
    //     cell: info => (
    //         <NameCell directValue={info.row.original.neighborhood?.name} />
    //     )
    // }),
    columnHelper.accessor('code', {
        header: 'Code',
        cell: info => <Cell value={info.getValue()} />
    }),
    columnHelper.accessor('created_at', {
        header: 'Created At',
        cell: info => <DateCell fullDate value={info.getValue()} />,
        enableColumnFilter: false
    })
];

export const branchesFields = [
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
        name: 'name.ar',
        label: 'validation.name.label.ar',
        type: 'text',
        placeholder: 'validation.name.placeholder.ar',
        editMode: true,
        viewMode: true
    },
    {
        name: 'code',
        label: 'validation.code.label',
        type: 'number',
        placeholder: 'validation.code.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'status',
        label: 'validation.status.label',
        type: 'select',
        placeholder: 'validation.status.placeholder',
        options: enabledDisabledOptions,
        editMode: true,
        viewMode: true
    },
];
