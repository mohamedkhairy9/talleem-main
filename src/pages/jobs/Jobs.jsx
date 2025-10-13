import React from 'react';
import { useJobsQuery } from '@/api/hooks/useJobs';
import Table from '@/components/common/table/Table';
import { jobsColumns } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import usePagination from '@/utils/hooks/global/usePagination';
import CreateJob from './CreateJob';
import EditJob from './EditJob';
import DeleteJob from './DeleteJob';
import useLocale from '@/utils/hooks/global/useLocale';
import i18next from 'i18next';
import { getOriginalObject } from '@/utils/helpers/global.fns';

export default function Jobs() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, setPagination } = usePagination();
    const { data, isLoading, refresh } = useJobsQuery(pagination);
    const { t } = useLocale();

    const tableData = data?.data?.map(item => ({
        ...item,
        name: item.name?.[i18next.language]
    }));

    return (
        <div>
            <Table
                title={t('table_titles.jobs')}
                refresh={refresh}
                loading={isLoading}
                data={tableData}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={jobsColumns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setPagination}
            />
            {isOpen.add && <CreateJob onClose={toggle.add} />}
            {isOpen.edit && (
                <EditJob
                    onClose={toggle.edit}
                    oldData={getOriginalObject(isOpen.edit, data?.data)}
                />
            )}
            {isOpen.delete && (
                <DeleteJob onClose={toggle.delete} id={isOpen.delete?.id} />
            )}
        </div>
    );
}
