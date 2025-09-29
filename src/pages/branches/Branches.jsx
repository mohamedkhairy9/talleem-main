import React from 'react';
import { useBranchesQuery } from '@/api/hooks/useBranches';
import Table from '@/components/common/table/Table';
import { branchesColumns } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import usePagination from '@/utils/hooks/global/usePagination';
import CreateBranch from './CreateBranch';
import EditBranch from './EditBranch';
import DeleteBranch from './DeleteBranch';

export default function Branches() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, setPagination } = usePagination();
    const { data, isLoading, refresh } = useBranchesQuery(pagination);

    return (
        <div>
            <Table
                title="Branches"
                refresh={refresh}
                loading={isLoading}
                data={data?.data}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={branchesColumns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setPagination}
            />
            {isOpen.add && <CreateBranch onClose={toggle.add} />}
            {isOpen.edit && (
                <EditBranch onClose={toggle.edit} oldData={isOpen.edit} />
            )}
            {isOpen.delete && (
                <DeleteBranch onClose={toggle.delete} id={isOpen.delete?.id} />
            )}
        </div>
    );
}
