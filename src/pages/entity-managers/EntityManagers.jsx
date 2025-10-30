import React from 'react';
import { useEntityManagersQuery } from '@/api/hooks/useEntityManagers';
import Table from '@/components/common/table/Table';
import { entityManagersColumns, filtersDefaultValues } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import useFiltering from '@/utils/hooks/global/useFiltering';
import CreateEntityManager from './CreateEntityManager';
import EditEntityManager from './EditEntityManager';
import DeleteEntityManager from './DeleteEntityManager';
import ViewEntityManager from './ViewEntityManager';
import useLocale from '@/utils/hooks/global/useLocale';
import i18next from 'i18next';
import { getOriginalObject } from '@/utils/helpers/global.fns';
import Filters from './Filters';

export default function EntityManagers() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, handleFilter, filters, setter, setFilters } =
        useFiltering(filtersDefaultValues);
    const { data, isLoading, refresh } = useEntityManagersQuery(filters);
    const { t } = useLocale();

    const tableData = data?.data?.map(item => ({
        ...item,
        name: item.name?.[i18next.language],
        entity: {
            ...item.entity,
            name: item.entity?.name?.[i18next.language]
        }
    }));

    const formData = data?.data?.map(item => ({
        ...item,
        entity_id: item.entity?.id,
        nationality_id: item.nationality?.id,
        branch_id: item.branch?.id,
        city_id: item.city?.id,
        academic_level_id: item.academic_level?.id,
        specification_id: item.specification?.id
    }));

    return (
        <div>
            <Table
                enableAdd={false}
                enableDelete={false}
                title={t('table_titles.entity_managers')}
                refresh={refresh}
                loading={isLoading}
                data={tableData}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={entityManagersColumns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setter('pagination')}
                Filters={
                    <Filters filters={filters} handleFilter={handleFilter} />
                }
                setFilters={setFilters}
                filters={filters}
            />
            {isOpen.add && <CreateEntityManager onClose={toggle.add} />}
            {isOpen.edit && (
                <EditEntityManager
                    onClose={toggle.edit}
                    oldData={getOriginalObject(isOpen.edit, formData)}
                />
            )}
            {isOpen.view && (
                <ViewEntityManager
                    onClose={toggle.view}
                    oldData={getOriginalObject(isOpen.view, formData)}
                />
            )}
            {isOpen.delete && (
                <DeleteEntityManager
                    onClose={toggle.delete}
                    id={isOpen.delete?.id}
                />
            )}
        </div>
    );
}
