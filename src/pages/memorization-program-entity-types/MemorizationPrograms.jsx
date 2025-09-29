import React from 'react';
import { useMemorizationProgramEntityTypesQuery } from '@/api/hooks/useMemorizationProgramEntityTypes';
import Table from '@/components/common/table/Table';
import { memorizationProgramEntityTypesColumns } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import usePagination from '@/utils/hooks/global/usePagination';
import CreateMemorizationProgramEntityType from './CreateMemorizationProgramEntityType';
import EditMemorizationProgramEntityType from './EditMemorizationProgramEntityType';
import DeleteMemorizationProgramEntityType from './DeleteMemorizationProgramEntityType';

export default function MemorizationPrograms() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, setPagination } = usePagination();
    const { data, isLoading, refresh } =
        useMemorizationProgramEntityTypesQuery(pagination);

    return (
        <div>
            <Table
                title="Memorization Programs"
                refresh={refresh}
                loading={isLoading}
                data={data?.data}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={memorizationProgramEntityTypesColumns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setPagination}
            />
            {isOpen.add && (
                <CreateMemorizationProgramEntityType onClose={toggle.add} />
            )}
            {isOpen.edit && (
                <EditMemorizationProgramEntityType
                    onClose={toggle.edit}
                    oldData={isOpen.edit}
                />
            )}
            {isOpen.delete && (
                <DeleteMemorizationProgramEntityType
                    onClose={toggle.delete}
                    id={isOpen.delete?.id}
                />
            )}
        </div>
    );
}
