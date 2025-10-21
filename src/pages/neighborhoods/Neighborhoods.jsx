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
import i18next from 'i18next';
import { getOriginalObject } from '@/utils/helpers/global.fns';
import ViewNeighborhood from './ViewNeighborhood';

export default function Neighborhoods() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, setPagination } = usePagination();
    const { data, isLoading, refresh } = useNeighborhoodsQuery(pagination);
    const { t } = useLocale();

    const tableData = data?.data?.map(item => ({
        ...item,
        name: item.name?.[i18next.language],
        city: {
            ...item.city,
            name: item.city?.name?.[i18next.language]
        }
    }));

    const formData = data?.data?.map(item => ({
        ...item,
        city_id: item.city?.id
    }));

    return (
        <div>
            <Table
                title={t('table_titles.neighborhoods')}
                refresh={refresh}
                loading={isLoading}
                data={tableData}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={neighborhoodsColumns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setPagination}
            />
            {isOpen.add && <CreateNeighborhood onClose={toggle.add} />}
            {isOpen.edit && (
                <EditNeighborhood
                    onClose={toggle.edit}
                    oldData={getOriginalObject(isOpen.edit, formData)}
                />
            )}
            {isOpen.view && (
                <ViewNeighborhood
                    onClose={toggle.view}
                    oldData={getOriginalObject(isOpen.view, formData)}
                />
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
