import React from 'react';
import { useCountriesQuery } from '@/api/hooks/useCountries';
import Table from '@/components/common/table/Table';
import { countriesColumns, filtersDefaultValues } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import useFiltering from '@/utils/hooks/global/useFiltering';
import CreateCountry from './CreateCountry';
import EditCountry from './EditCountry';
import DeleteCountry from './DeleteCountry';
import ViewCountry from './ViewCountry';
import useLocale from '@/utils/hooks/global/useLocale';
import i18next from 'i18next';
import { getOriginalObject } from '@/utils/helpers/global.fns';
import Filters from './Filters';

export default function Countries() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, handleFilter, filters, setter, setFilters } =
        useFiltering(filtersDefaultValues);
    const { data, isLoading, refresh } = useCountriesQuery(filters);
    const { t } = useLocale();

    const tableData = data?.data?.map(item => ({
        ...item,
        name: item.name?.[i18next.language]
    }));

    const formData = data?.data?.map(item => ({
        id: item.id,
        name: item.name,
        status: item.status,
        // ...item,
        // 'name.en': item.name?.en,
        // 'name.ar': item.name?.ar,
        short_name: item.short_name,
        phone_code: item.phone_code
    }));

    return (
        <div>
            <Table
                resource="countries"
                title={t('table_titles.countries')}
                refresh={refresh}
                loading={isLoading}
                data={tableData}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={countriesColumns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setter('pagination')}
                Filters={
                    <Filters filters={filters} handleFilter={handleFilter} />
                }
                setFilters={setFilters}
                filters={filters}
            />
            {isOpen.add && <CreateCountry onClose={toggle.add} />}
            {isOpen.edit && (
                <EditCountry
                    onClose={toggle.edit}
                    oldData={getOriginalObject(isOpen.edit, formData)}
                />
            )}
            {isOpen.view && (
                <ViewCountry
                    onClose={toggle.view}
                    oldData={getOriginalObject(isOpen.view, formData)}
                />
            )}
            {isOpen.delete && (
                <DeleteCountry onClose={toggle.delete} id={isOpen.delete?.id} />
            )}
        </div>
    );
}
