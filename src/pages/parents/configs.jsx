import Cell from '@/components/common/table/cells/Cell';
import ActiveCell from '@/components/common/table/cells/ActiveCell';
import DateCell from '@/components/common/table/cells/DateCell';
import NameCell from '@/components/common/table/cells/NameCell';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';
import i18next from 'i18next';

const columnHelper = createColumnHelper();

function studentsColumnDisplay(students) {
    const list = students ?? [];
    if (list.length === 0) return '-';
    const first = list[0];
    const firstName =
        first && typeof first.student_name === 'object'
            ? first.student_name[i18next.language] ?? first.student_name?.en ?? first.student_name?.ar
            : first?.student_name;
    const restCount = list.length - 1;
    return restCount > 0 ? `${firstName ?? `#${first?.student_id}`} (+${restCount})` : (firstName ?? `#${first?.student_id}` ?? '-');
}

export const parentsColumns = [
    columnHelper.accessor('name', {
        header: 'table_headers.name',
        cell: info => <NameCell directValue={info.row.original.name} />
    }),
    columnHelper.accessor('phone_1', {
        header: 'table_headers.phone_1',
        cell: info => <Cell value={info.getValue()} />
    }),
    columnHelper.accessor('phone_2', {
        header: 'table_headers.phone_2',
        cell: info => <Cell value={info.getValue()} />
    }),
    columnHelper.accessor(row => studentsColumnDisplay(row.students), {
        id: 'students',
        header: 'table_headers.students_count',
        cell: info => <Cell value={info.getValue()} />,
        enableColumnFilter: false
    }),
    // columnHelper.accessor('status', {
    //     header: 'table_headers.status',
    //     cell: info => <ActiveCell info={info} />
    // }),
    columnHelper.accessor('created_at', {
        header: 'table_headers.created_at',
        cell: info => <DateCell fullDate value={info.getValue()} />,
        enableColumnFilter: false
    })
];

export const parentsFields = [
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
        name: 'phone_1',
        label: 'validation.phone_1.label',
        type: 'text',
        placeholder: 'validation.phone_1.placeholder',
        editMode: true,
        viewMode: true
    },
    {
        name: 'phone_2',
        label: 'validation.phone_2.label',
        type: 'text',
        placeholder: 'validation.phone_2.placeholder',
        editMode: true,
        viewMode: true
    }
];

export const parentsDefaultValues = {
    name: {
        en: '',
        ar: ''
    },
    phone_1: '',
    phone_2: ''
};

export const parentsFilters = [
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
