import React from 'react';
import { useJobsQuery } from '@/api/hooks/useJobs';
import Table from '@/components/common/table/Table';
import { jobsColumns } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import usePagination from '@/utils/hooks/global/usePagination';
import CreateJob from './CreateJob';
import EditJob from './EditJob';
import DeleteJob from './DeleteJob';

export default function Jobs() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, setPagination } = usePagination();
    const { data, isLoading, refresh } = useJobsQuery(pagination);

    return (
        <div>
            <Table
                title="Jobs"
                refresh={refresh}
                loading={isLoading}
                data={data?.data}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={jobsColumns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setPagination}
            />
            {isOpen.add && (
                <CreateJob onClose={toggle.add} />
            )}
            {isOpen.edit && (
                <EditJob
                    onClose={toggle.edit}
                    oldData={isOpen.edit}
                />
            )}
            {isOpen.delete && (
                <DeleteJob onClose={toggle.delete} id={isOpen.delete?.id} />
            )}
        </div>
    );
}
