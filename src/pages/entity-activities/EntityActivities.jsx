import React from 'react';
import { useEntityActivitiesQuery } from '@/api/hooks/useEntityActivities';
import Table from '@/components/common/table/Table';
import { entityActivitiesColumns, filtersDefaultValues } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import CreateEntityActivity from './CreateEntityActivity';
import EditEntityActivity from './EditEntityActivity';
import DeleteEntityActivity from './DeleteEntityActivity';
import useLocale from '@/utils/hooks/global/useLocale';
import { getOriginalObject } from '@/utils/helpers/global.fns';
import ViewEntityActivity from './ViewEntityActivity';
import useFiltering from '@/utils/hooks/global/useFiltering';
import Filters from './Filters';

export default function EntityActivities() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, handleFilter, filters, setter, setFilters } =
        useFiltering(filtersDefaultValues);
    const { data, isLoading, refresh } = useEntityActivitiesQuery(filters);
    const { t } = useLocale();

    const tableData = data?.data;

    const formData = data?.data?.map(item => ({
        ...item,
        entity_id: item.entity_id?.id,
        activity_id: item.activity_id
    }));

    return (
        <div>
            <Table
                resource="entity_activities"
                title={t('table_titles.entity_activities')}
                refresh={refresh}
                loading={isLoading}
                data={tableData}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={entityActivitiesColumns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setter('pagination')}
                Filters={
                    <Filters filters={filters} handleFilter={handleFilter} />
                }
                setFilters={setFilters}
                filters={filters}
            />
            {isOpen.add && <CreateEntityActivity onClose={toggle.add} />}
            {isOpen.edit && (
                <EditEntityActivity
                    onClose={toggle.edit}
                    oldData={getOriginalObject(isOpen.edit, formData)}
                />
            )}
            {isOpen.view && (
                <ViewEntityActivity
                    onClose={toggle.view}
                    oldData={getOriginalObject(isOpen.view, formData)}
                />
            )}
            {isOpen.delete && (
                <DeleteEntityActivity
                    onClose={toggle.delete}
                    id={isOpen.delete?.id}
                />
            )}
        </div>
    );
}
