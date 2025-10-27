import React from 'react';
import { useEntityCategoriesQuery } from '@/api/hooks/useEntityCategories';
import Table from '@/components/common/table/Table';
import { entityCategoriesColumns, filtersDefaultValues } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import useFiltering from '@/utils/hooks/global/useFiltering';
import CreateEntityCategory from './CreateEntityCategory';
import EditEntityCategory from './EditEntityCategory';
import DeleteEntityCategory from './DeleteEntityCategory';
import useLocale from '@/utils/hooks/global/useLocale';
import i18next from 'i18next';
import { getOriginalObject } from '@/utils/helpers/global.fns';
import ViewEntityCategory from './ViewEntityCategory';
import Filters from './Filters';

export default function EntityCategories() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, handleFilter, filters, setter, setFilters } =
        useFiltering(filtersDefaultValues);
    const { data, isLoading, refresh } = useEntityCategoriesQuery(filters);
    const { t } = useLocale();

    const tableData = data?.data?.map(item => ({
        ...item,
        name: item.name?.[i18next.language]
    }));

    return (
        <div>
            <Table
                title={t('table_titles.entity_categories')}
                refresh={refresh}
                loading={isLoading}
                data={tableData}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={entityCategoriesColumns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setter('pagination')}
                Filters={
                    <Filters filters={filters} handleFilter={handleFilter} />
                }
                setFilters={setFilters}
                filters={filters}
            />
            {isOpen.add && <CreateEntityCategory onClose={toggle.add} />}
            {isOpen.edit && (
                <EditEntityCategory
                    onClose={toggle.edit}
                    oldData={getOriginalObject(isOpen.edit, data?.data)}
                />
            )}
            {isOpen.view && (
                <ViewEntityCategory
                    onClose={toggle.view}
                    oldData={getOriginalObject(isOpen.view, data?.data)}
                />
            )}
            {isOpen.delete && (
                <DeleteEntityCategory
                    onClose={toggle.delete}
                    id={isOpen.delete?.id}
                />
            )}
        </div>
    );
}
