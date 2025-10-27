import React from 'react';
import { useMemorizationProgramEntityTypesQuery } from '@/api/hooks/useMemorizationProgramEntityTypes';
import Table from '@/components/common/table/Table';
import {
    memorizationProgramEntityTypesColumns,
    filtersDefaultValues
} from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import useFiltering from '@/utils/hooks/global/useFiltering';
import CreateMemorizationProgramEntityType from './CreateMemorizationProgramEntityType';
import EditMemorizationProgramEntityType from './EditMemorizationProgramEntityType';
import DeleteMemorizationProgramEntityType from './DeleteMemorizationProgramEntityType';
import useLocale from '@/utils/hooks/global/useLocale';
import i18next from 'i18next';
import { getOriginalObject } from '@/utils/helpers/global.fns';
import ViewMemorizationProgramEntityType from './ViewMemorizationProgramEntityType';
import Filters from './Filters';

export default function MemorizationPrograms() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, handleFilter, filters, setter, setFilters } =
        useFiltering(filtersDefaultValues);
    const { data, isLoading, refresh } =
        useMemorizationProgramEntityTypesQuery(filters);
    const { t } = useLocale();

    const tableData = data?.data?.map(item => ({
        ...item,
        name: item.name?.[i18next.language]
    }));

    return (
        <div>
            <Table
                title={t('table_titles.memorization_programs')}
                refresh={refresh}
                loading={isLoading}
                data={tableData}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={memorizationProgramEntityTypesColumns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setter('pagination')}
                Filters={
                    <Filters filters={filters} handleFilter={handleFilter} />
                }
                setFilters={setFilters}
                filters={filters}
            />
            {isOpen.add && (
                <CreateMemorizationProgramEntityType onClose={toggle.add} />
            )}
            {isOpen.edit && (
                <EditMemorizationProgramEntityType
                    onClose={toggle.edit}
                    oldData={getOriginalObject(isOpen.edit, data?.data)}
                />
            )}
            {isOpen.view && (
                <ViewMemorizationProgramEntityType
                    onClose={toggle.view}
                    oldData={getOriginalObject(isOpen.view, data?.data)}
                />
            )}
            {isOpen.delete && (
                <DeleteMemorizationProgramEntityType
                    onClose={toggle.delete}
                    id={isOpen.delete?.id}
                />
            )}
        </div>
    );
}
