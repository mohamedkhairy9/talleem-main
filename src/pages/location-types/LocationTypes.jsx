import React from 'react';
import { useLocationTypesQuery } from '@/api/hooks/useLocationTypes';
import Table from '@/components/common/table/Table';
import { locationTypesColumns } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import usePagination from '@/utils/hooks/global/usePagination';
import CreateLocationType from './CreateLocationType';
import EditLocationType from './EditLocationType';
import DeleteLocationType from './DeleteLocationType';

export default function LocationTypes() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, setPagination } = usePagination();
    const { data, isLoading, refresh } = useLocationTypesQuery(pagination);

    return (
        <div>
            <Table
                title="Location Types"
                refresh={refresh}
                loading={isLoading}
                data={data?.data}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={locationTypesColumns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setPagination}
            />
            {isOpen.add && <CreateLocationType onClose={toggle.add} />}
            {isOpen.edit && (
                <EditLocationType onClose={toggle.edit} oldData={isOpen.edit} />
            )}
            {isOpen.delete && (
                <DeleteLocationType
                    onClose={toggle.delete}
                    id={isOpen.delete?.id}
                />
            )}
        </div>
    );
}
