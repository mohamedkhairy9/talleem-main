import React from 'react';
import { useEntitiesQuery } from '@/api/hooks/useEntities';
import Table from '@/components/common/table/Table';
import { entitiesColumns, filtersDefaultValues } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import useFiltering from '@/utils/hooks/global/useFiltering';
import CreateEntity from './CreateEntity';
import EditEntity from './EditEntity';
import DeleteEntity from './DeleteEntity';
import ViewEntity from './ViewEntity';
import useLocale from '@/utils/hooks/global/useLocale';
import { getOriginalObject } from '@/utils/helpers/global.fns';
import Filters from './Filters';

export default function Entities() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, handleFilter, filters, setter, setFilters } =
        useFiltering(filtersDefaultValues);
    const { data, isLoading, refresh } = useEntitiesQuery(filters);
    const { t } = useLocale();

    const tableData = data?.data;

    console.log('tableData', tableData);

    const formData = data?.data?.map(item => ({
        ...item,
        user_id: item.user?.id,
        branch_id: item.branch?.id,
        main_program_id: item.main_program?.id,
        entity_category_id: item.entity_category?.id,
        education_program_entity_type_id:
            item.education_program_entity_type?.id,
        city_id: item.city?.id,
        neighborhood_id: item.neighborhood?.id,
        location_type_id: item.location_type?.id
    }));

    return (
        <div>
            <Table
                title={t('table_titles.entities')}
                refresh={refresh}
                loading={isLoading}
                data={tableData}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={entitiesColumns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setter('pagination')}
                Filters={
                    <Filters filters={filters} handleFilter={handleFilter} />
                }
                setFilters={setFilters}
                filters={filters}
            />
            {isOpen.add && <CreateEntity onClose={toggle.add} />}
            {isOpen.edit && (
                <EditEntity
                    onClose={toggle.edit}
                    oldData={getOriginalObject(isOpen.edit, formData)}
                />
            )}
            {isOpen.view && (
                <ViewEntity
                    onClose={toggle.view}
                    oldData={getOriginalObject(isOpen.view, formData)}
                />
            )}
            {isOpen.delete && (
                <DeleteEntity onClose={toggle.delete} id={isOpen.delete?.id} />
            )}
        </div>
    );
}
