import React from 'react';
import { useActivitiesQuery } from '@/api/hooks/useActivities';
import Table from '@/components/common/table/Table';
import { activitiesColumns } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import usePagination from '@/utils/hooks/global/usePagination';
import CreateActivity from './CreateActivity';
import EditActivity from './EditActivity';
import DeleteActivity from './DeleteActivity';
import useLocale from '@/utils/hooks/global/useLocale';

export default function Activities() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, setPagination } = usePagination();
    const { data, isLoading, refresh } = useActivitiesQuery(pagination);
    const { t } = useLocale();

    return (
        <div>
            <Table
                title={t('table_titles.activities')}
                refresh={refresh}
                loading={isLoading}
                data={data?.data}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={activitiesColumns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setPagination}
            />
            {isOpen.add && <CreateActivity onClose={toggle.add} />}
            {isOpen.edit && (
                <EditActivity onClose={toggle.edit} oldData={isOpen.edit} />
            )}
            {isOpen.delete && (
                <DeleteActivity
                    onClose={toggle.delete}
                    id={isOpen.delete?.id}
                />
            )}
        </div>
    );
}
