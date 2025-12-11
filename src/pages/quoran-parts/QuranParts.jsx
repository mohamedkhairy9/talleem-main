import React from 'react';
import { useQuoranPartsQuery } from '@/api/hooks/useQuoranParts';
import Table from '@/components/common/table/Table';
import { quoranPartsColumns, filtersDefaultValues } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import useFiltering from '@/utils/hooks/global/useFiltering';
import CreateQuoranPart from './CreateQuoranPart';
import EditQuoranPart from './EditQuoranPart';
import DeleteQuoranPart from './DeleteQuoranPart';
import useLocale from '@/utils/hooks/global/useLocale';
import ViewQuoranPart from './ViewQuoranPart';
import Filters from './Filters';

export default function QuranParts() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, handleFilter, filters, setter, setFilters } =
        useFiltering(filtersDefaultValues);
    const { data, isLoading, refresh } = useQuoranPartsQuery(filters);
    const { t } = useLocale();

    const tableData = data?.data?.map(item => ({
        ...item
    }));

    console.log(tableData);

    return (
        <div>
            <Table
                title={t('table_titles.quoran_parts')}
                refresh={refresh}
                loading={isLoading}
                data={tableData}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={quoranPartsColumns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setter('pagination')}
                Filters={
                    <Filters filters={filters} handleFilter={handleFilter} />
                }
                setFilters={setFilters}
                filters={filters}
                enableAdd={false}
                enableEdit={false}
                enableDelete={false}
                enableView={false}
            />
            {isOpen.add && <CreateQuoranPart onClose={toggle.add} />}
            {isOpen.edit && (
                <EditQuoranPart onClose={toggle.edit} oldData={isOpen.edit} />
            )}
            {isOpen.view && (
                <ViewQuoranPart onClose={toggle.view} oldData={isOpen.view} />
            )}
            {isOpen.delete && (
                <DeleteQuoranPart
                    onClose={toggle.delete}
                    id={isOpen.delete?.id}
                />
            )}
        </div>
    );
}
