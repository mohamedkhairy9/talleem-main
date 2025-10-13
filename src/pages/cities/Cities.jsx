import React from 'react';
import { useCitiesQuery } from '@/api/hooks/useCities';
import Table from '@/components/common/table/Table';
import { citiesColumns } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import usePagination from '@/utils/hooks/global/usePagination';
import CreateCity from './CreateCity';
import EditCity from './EditCity';
import DeleteCity from './DeleteCity';
import useLocale from '@/utils/hooks/global/useLocale';
import i18next from 'i18next';
import { getOriginalObject } from '@/utils/helpers/global.fns';

export default function Cities() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, setPagination } = usePagination();
    const { data, isLoading, refresh } = useCitiesQuery(pagination);
    const { t } = useLocale();

    const tableData = data?.data?.map(item => ({
        ...item,
        name: item.name?.[i18next.language]
    }));

    return (
        <div>
            <Table
                title={t('table_titles.cities')}
                refresh={refresh}
                loading={isLoading}
                data={tableData}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={citiesColumns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setPagination}
            />
            {isOpen.add && <CreateCity onClose={toggle.add} />}
            {isOpen.edit && (
                <EditCity
                    onClose={toggle.edit}
                    oldData={getOriginalObject(isOpen.edit, data?.data)}
                />
            )}
            {isOpen.delete && (
                <DeleteCity onClose={toggle.delete} id={isOpen.delete?.id} />
            )}
        </div>
    );
}
