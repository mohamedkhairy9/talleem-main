import { createColumnHelper } from '@tanstack/react-table';
import NameEmailCell from '@/components/common/table/cells/NameEmailCell';
import RoleCell from '@/components/common/table/cells/RoleCell';
import DateCell from '@/components/common/table/cells/DateCell';

const columnHelper = createColumnHelper();

export function useColumnsHeaders() {
    return {
        username: columnHelper.accessor('username', {
            header: 'Username',
            cell: info => <NameEmailCell info={info} />
        }),
        role: columnHelper.accessor('role', {
            header: 'Role',
            cell: info => <RoleCell info={info} />
        }),
        createdAt: columnHelper.accessor('createdAt', {
            header: 'Created At',
            cell: info => <DateCell info={info} />
        }),
        updatedAt: columnHelper.accessor('updatedAt', {
            header: 'Updated At',
            cell: info => <DateCell info={info} />
        })
    };
}
