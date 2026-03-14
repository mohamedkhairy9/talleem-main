import React from 'react';
import { useBranchesQuery } from '@/api/hooks/useBranches';
import Table from '@/components/common/table/Table';
import { branchesColumns, filtersDefaultValues } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import useFiltering from '@/utils/hooks/global/useFiltering';
import CreateBranch from './CreateBranch';
import EditBranch from './EditBranch';
import DeleteBranch from './DeleteBranch';
import useLocale from '@/utils/hooks/global/useLocale';
import i18next from 'i18next';
import { getOriginalObject } from '@/utils/helpers/global.fns';
import ViewBranch from './ViewBranch';
import Filters from './Filters';

export default function Branches() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, handleFilter, filters, setter, setFilters } =
        useFiltering(filtersDefaultValues);
    const { data, isLoading, refresh } = useBranchesQuery(filters);
    const { t } = useLocale();

    const tableData = data?.data?.map(item => ({
        ...item,
        name: item.name?.[i18next.language]
    }));

    const formData = data?.data?.map(item => ({
        id: item.id,
        name: item.name,
        code: item.code,
        status: item.status,
        city_id: item.city.id,
        neighborhood_id: item.neighborhood.id
    }));

    return (
        <div>
            <Table
                resource="branches"
                title={t('table_titles.branches')}
                refresh={refresh}
                loading={isLoading}
                data={tableData}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={branchesColumns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setter('pagination')}
                Filters={
                    <Filters filters={filters} handleFilter={handleFilter} />
                }
                setFilters={setFilters}
                filters={filters}
            />
            {isOpen.add && <CreateBranch onClose={toggle.add} />}
            {isOpen.edit && (
                <EditBranch
                    onClose={toggle.edit}
                    oldData={getOriginalObject(isOpen.edit, formData)}
                />
            )}
            {isOpen.view && (
                <ViewBranch
                    onClose={toggle.view}
                    oldData={getOriginalObject(isOpen.view, formData)}
                />
            )}
            {isOpen.delete && (
                <DeleteBranch onClose={toggle.delete} id={isOpen.delete?.id} />
            )}
        </div>
    );
}
