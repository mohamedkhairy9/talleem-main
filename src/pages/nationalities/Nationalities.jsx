import React from 'react';
import { useNationalitiesQuery } from '@/api/hooks/useNationalities';
import Table from '@/components/common/table/Table';
import { nationalitiesColumns, filtersDefaultValues } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import useFiltering from '@/utils/hooks/global/useFiltering';
import CreateNationality from './CreateNationality';
import EditNationality from './EditNationality';
import DeleteNationality from './DeleteNationality';
import ViewNationality from './ViewNationality';
import useLocale from '@/utils/hooks/global/useLocale';
import i18next from 'i18next';
import { getOriginalObject } from '@/utils/helpers/global.fns';
import Filters from './Filters';

export default function Nationalities() {

    const { isOpen, toggle } = useIsOpen();
    const { pagination, handleFilter, filters, setter, setFilters } =
        useFiltering(filtersDefaultValues);
    const { data, isLoading, refresh } = useNationalitiesQuery(filters);
    const { t } = useLocale();

    const tableData = data?.data?.map(item => ({
        ...item,
        name: item.name?.[i18next.language],
        country: item.country?.[i18next.language]
    }));

    const formData = data?.data?.map(item => ({
        id: item.id,
        name: item.name,
        status: item.status,
        country_id: item.country_id
    }));

    return (
        <div>
            <Table
                title={t('table_titles.nationalities')}
                refresh={refresh}
                loading={isLoading}
                data={tableData}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={nationalitiesColumns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setter('pagination')}
                Filters={
                    <Filters filters={filters} handleFilter={handleFilter} />
                }
                setFilters={setFilters}
                filters={filters}
            />
            {isOpen.add && <CreateNationality onClose={toggle.add} />}
            {isOpen.edit && (
                <EditNationality
                    onClose={toggle.edit}
                    oldData={getOriginalObject(isOpen.edit, formData)}
                />
            )}
            {isOpen.view && (
                <ViewNationality
                    onClose={toggle.view}
                    oldData={getOriginalObject(isOpen.view, formData)}
                />
            )}
            {isOpen.delete && (
                <DeleteNationality
                    onClose={toggle.delete}
                    id={isOpen.delete?.id}
                />
            )}
        </div>
    );
}
