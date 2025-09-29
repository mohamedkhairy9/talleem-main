import React from 'react';
import { useNeighborhoodsQuery } from '@/api/hooks/useNeighborhoods';
import Table from '@/components/common/table/Table';
import { neighborhoodsColumns } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import usePagination from '@/utils/hooks/global/usePagination';
import CreateNeighborhood from './CreateNeighborhood';
import EditNeighborhood from './EditNeighborhood';
import DeleteNeighborhood from './DeleteNeighborhood';
import useLocale from '@/utils/hooks/global/useLocale';

export default function Neighborhoods() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, setPagination } = usePagination();
    const { data, isLoading, refresh } = useNeighborhoodsQuery(pagination);
    const { t } = useLocale();

    return (
        <div>
            <Table
                title={t('table_titles.neighborhoods')}
                refresh={refresh}
                loading={isLoading}
                data={data?.data}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={neighborhoodsColumns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setPagination}
            />
            {isOpen.add && <CreateNeighborhood onClose={toggle.add} />}
            {isOpen.edit && (
                <EditNeighborhood onClose={toggle.edit} oldData={isOpen.edit} />
            )}
            {isOpen.delete && (
                <DeleteNeighborhood
                    onClose={toggle.delete}
                    id={isOpen.delete?.id}
                />
            )}
        </div>
    );
}
