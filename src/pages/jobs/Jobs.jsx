import React from 'react';
import { useJobsQuery } from '@/api/hooks/useJobs';
import Table from '@/components/common/table/Table';
import { jobsColumns, filtersDefaultValues } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import useFiltering from '@/utils/hooks/global/useFiltering';
import CreateJob from './CreateJob';
import EditJob from './EditJob';
import DeleteJob from './DeleteJob';
import useLocale from '@/utils/hooks/global/useLocale';
import i18next from 'i18next';
import { getOriginalObject } from '@/utils/helpers/global.fns';
import ViewJob from './ViewJob';
import Filters from './Filters';

export default function Jobs() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, handleFilter, filters, setter, setFilters } =
        useFiltering(filtersDefaultValues);
    const { data, isLoading, refresh } = useJobsQuery(filters);
    const { t } = useLocale();

    const tableData = data?.data?.map(item => ({
        ...item,
        name: item.name?.[i18next.language]
    }));

    const formData = data?.data?.map(({ created_at, updated_at, ...item }) => item);

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
                setPagination={setter('pagination')}
                Filters={
                    <Filters filters={filters} handleFilter={handleFilter} />
                }
                setFilters={setFilters}
                filters={filters}
            />
            {isOpen.add && <CreateJob onClose={toggle.add} />}
            {isOpen.edit && (
                <EditJob
                    onClose={toggle.edit}
                    oldData={getOriginalObject(isOpen.edit, formData)}
                />
            )}
            {isOpen.view && (
                <ViewJob
                    onClose={toggle.view}
                    oldData={getOriginalObject(isOpen.view, formData)}
                />
            )}
            {isOpen.delete && (
                <DeleteJob onClose={toggle.delete} id={isOpen.delete?.id} />
            )}
        </div>
    );
}
