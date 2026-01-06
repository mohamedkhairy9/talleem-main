import React from 'react';
import { useCitiesQuery } from '@/api/hooks/useCities';
import Table from '@/components/common/table/Table';
import { citiesColumns, filtersDefaultValues } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import useFiltering from '@/utils/hooks/global/useFiltering';
import CreateCity from './CreateCity';
import EditCity from './EditCity';
import DeleteCity from './DeleteCity';
import useLocale from '@/utils/hooks/global/useLocale';
import i18next from 'i18next';
import { getOriginalObject } from '@/utils/helpers/global.fns';
import ViewCity from './ViewCity';
import Filters from './Filters';

export default function Cities() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, handleFilter, filters, setter, setFilters } =
        useFiltering(filtersDefaultValues);
    const { data, isLoading, refresh } = useCitiesQuery(filters);
    const { t } = useLocale();

    const tableData = (data?.data || []).map(item => ({
        ...item,
        country: item.country?.name?.[i18next.language],
        name: item.name?.[i18next.language]
    }));

    const formData = (data?.data || []).map(item => ({
        id: item.id,
        name: item.name,
        status: item.status,
        country_id: item.country?.id
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
                setPagination={setter('pagination')}
                Filters={
                    <Filters filters={filters} handleFilter={handleFilter} />
                }
                setFilters={setFilters}
                filters={filters}
            />
            {isOpen.add && <CreateCity onClose={toggle.add} />}
            {isOpen.edit && (
                <EditCity
                    onClose={toggle.edit}
                    oldData={getOriginalObject(isOpen.edit, formData)}
                />
            )}
            {isOpen.view && (
                <ViewCity
                    onClose={toggle.view}
                    oldData={getOriginalObject(isOpen.view, formData)}
                />
            )}
            {isOpen.delete && (
                <DeleteCity onClose={toggle.delete} id={isOpen.delete?.id} />
            )}
        </div>
    );
}
