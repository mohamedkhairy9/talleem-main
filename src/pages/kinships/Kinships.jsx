import React from 'react';
import { useKinshipsQuery } from '@/api/hooks/useKinships';
import Table from '@/components/common/table/Table';
import { kinshipsColumns, filtersDefaultValues } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import useFiltering from '@/utils/hooks/global/useFiltering';
import CreateKinship from './CreateKinship';
import EditKinship from './EditKinship';
import DeleteKinship from './DeleteKinship';
import useLocale from '@/utils/hooks/global/useLocale';
import i18next from 'i18next';
import { getOriginalObject } from '@/utils/helpers/global.fns';
import ViewKinship from './ViewKinship';
import Filters from './Filters';

export default function Kinships() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, handleFilter, filters, setter, setFilters } =
        useFiltering(filtersDefaultValues);
    const { data, isLoading, refresh } = useKinshipsQuery(filters);
    const { t } = useLocale();

    const tableData = data?.data?.map(item => ({
        ...item,
        name: item.name?.[i18next.language]

    }));

    const formData = data?.data?.map(({ created_at, updated_at, ...item }) => item);
    
    return (
        <div>
            <Table
                resource="kinships"
                title={t('table_titles.kinships')}
                refresh={refresh}
                loading={isLoading}
                data={tableData}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={kinshipsColumns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setter('pagination')}
                Filters={
                    <Filters filters={filters} handleFilter={handleFilter} />
                }
                setFilters={setFilters}
                filters={filters}
            />
            {isOpen.add && <CreateKinship onClose={toggle.add} />}
            {isOpen.edit && (
                <EditKinship
                    onClose={toggle.edit}
                    oldData={getOriginalObject(isOpen.edit, formData)}
                />
            )}
            {isOpen.view && (
                <ViewKinship
                    onClose={toggle.view}
                    oldData={getOriginalObject(isOpen.view, formData)}
                />
            )}
            {isOpen.delete && (
                <DeleteKinship onClose={toggle.delete} id={isOpen.delete?.id} />
            )}
        </div>
    );
}
