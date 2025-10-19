import Cell from '@/components/common/table/cells/Cell';
import DateCell from '@/components/common/table/cells/DateCell';
import NameCell from '@/components/common/table/cells/NameCell';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';
import { enabledDisabledOptions } from '@/utils/constants/options';

const columnHelper = createColumnHelper();

export const citiesColumns = [
    columnHelper.accessor('name', {
        header: 'City',
        cell: info => <NameCell directValue={info.row.original.name} />
    })
];

export const citiesFields = [
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
        defaultValue: true,
        options: enabledDisabledOptions,
        editMode: true,
        viewMode: true,
    }
];
