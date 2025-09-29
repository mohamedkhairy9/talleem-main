import React from 'react';
import { useSessionPeriodsQuery } from '@/api/hooks/useSessionPeriods';
import Table from '@/components/common/table/Table';
import { sessionPeriodsColumns } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import usePagination from '@/utils/hooks/global/usePagination';
import CreateSessionPeriod from './CreateSessionPeriod';
import EditSessionPeriod from './EditSessionPeriod';
import DeleteSessionPeriod from './DeleteSessionPeriod';
import useLocale from '@/utils/hooks/global/useLocale';

export default function SessionPeriods() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, setPagination } = usePagination();
    const { data, isLoading, refresh } = useSessionPeriodsQuery(pagination);
    const { t } = useLocale();

    return (
        <div>
            <Table
                title={t('table_titles.session_periods')}
                refresh={refresh}
                loading={isLoading}
                data={data?.data}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={sessionPeriodsColumns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setPagination}
            />
            {isOpen.add && <CreateSessionPeriod onClose={toggle.add} />}
            {isOpen.edit && (
                <EditSessionPeriod
                    onClose={toggle.edit}
                    oldData={isOpen.edit}
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
