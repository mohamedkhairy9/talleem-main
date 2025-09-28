import Cell from '@/components/common/table/cells/Cell';
import DateCell from '@/components/common/table/cells/DateCell';
import NameCell from '@/components/common/table/cells/NameCell';
import RoleCell from '@/components/common/table/cells/RoleCell';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';

const columnHelper = createColumnHelper();

export const rolesColumns = [
    columnHelper.accessor('name', {
        header: 'Role',
        cell: info => <NameCell directValue={info.row.original.display_name} />
    }),
    columnHelper.accessor('guard_name', {
        header: 'Guard',
        cell: info => <Cell value={info.getValue()} />
    }),
    columnHelper.accessor('created_at', {
        header: 'Created At',
        cell: info => <DateCell fullDate value={info.getValue()} />,
        enableColumnFilter: false
    })
];
