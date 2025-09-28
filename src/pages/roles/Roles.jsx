import React from 'react';
import { useRolesQuery } from '@/api/hooks/useRoles';
import Table from '@/components/common/table/Table';
import { rolesColumns } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import usePagination from '@/utils/hooks/global/usePagination';

export default function Roles() {

    const { isOpen, toggle } = useIsOpen();
    const { pagination, setPagination } = usePagination();
    const { data, isLoading, refresh } = useRolesQuery(pagination);

    return (
        <div>
            <Table
                title="Roles"
                refresh={refresh}
                loading={isLoading}
                data={data?.data}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={rolesColumns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setPagination}
            />
            {isOpen.add && <CreateRole onClose={toggle.add} />}
            {isOpen.edit && (
                <EditRole onClose={toggle.edit} oldData={isOpen.edit} />
            )}
            {isOpen.delete && (
                <DeleteRole setIsOpen={toggle.delete} id={isOpen.delete?._id} />
            )}
        </div>
    );

}
