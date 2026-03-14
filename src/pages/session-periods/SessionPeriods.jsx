import React from 'react';
import { useSessionPeriodsQuery } from '@/api/hooks/useSessionPeriods';
import Table from '@/components/common/table/Table';
import { sessionPeriodsColumns, filtersDefaultValues } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import useFiltering from '@/utils/hooks/global/useFiltering';
import CreateSessionPeriod from './CreateSessionPeriod';
import EditSessionPeriod from './EditSessionPeriod';
import DeleteSessionPeriod from './DeleteSessionPeriod';
import useLocale from '@/utils/hooks/global/useLocale';
import i18next from 'i18next';
import { getOriginalObject } from '@/utils/helpers/global.fns';
import ViewSessionPeriod from './ViewSessionPeriod';
import Filters from './Filters';

export default function SessionPeriods() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, handleFilter, filters, setter, setFilters } =
        useFiltering(filtersDefaultValues);
    const { data, isLoading, refresh } = useSessionPeriodsQuery(filters);
    const { t } = useLocale();

    const tableData = data?.data?.map(item => ({
        ...item,
        name: item.name?.[i18next.language]
    }));

    const formData = data?.data?.map(({ created_at, updated_at, ...item }) => item);

    return (
        <div>
            <Table
                resource="session_periods"
                title={t('table_titles.session_periods')}
                refresh={refresh}
                loading={isLoading}
                data={tableData}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={sessionPeriodsColumns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setter('pagination')}
                Filters={
                    <Filters filters={filters} handleFilter={handleFilter} />
                }
                setFilters={setFilters}
                filters={filters}
            />
            {isOpen.add && <CreateSessionPeriod onClose={toggle.add} />}
            {isOpen.edit && (
                <EditSessionPeriod
                    onClose={toggle.edit}
                    oldData={getOriginalObject(isOpen.edit, formData)}
                />
            )}
            {isOpen.view && (
                <ViewSessionPeriod
                    onClose={toggle.view}
                    oldData={getOriginalObject(isOpen.view, formData)}
                />
            )}
            {isOpen.delete && (
                <DeleteSessionPeriod
                    onClose={toggle.delete}
                    id={isOpen.delete?.id}
                />
            )}
        </div>
    );
}
