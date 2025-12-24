import React from 'react';
import { useBranchAdministrationsQuery } from '@/api/hooks/useBranchAdministrations';
import Table from '@/components/common/table/Table';
import { branchAdministrationsColumns, filtersDefaultValues } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import useFiltering from '@/utils/hooks/global/useFiltering';
import CreateBranchAdministration from './CreateBranchAdministration';
import EditBranchAdministration from './EditBranchAdministration';
import DeleteBranchAdministration from './DeleteBranchAdministration';
import ViewBranchAdministration from './ViewBranchAdministration';
import useLocale from '@/utils/hooks/global/useLocale';
import i18next from 'i18next';
import { getOriginalObject } from '@/utils/helpers/global.fns';
import Filters from './Filters';

export default function BranchAdministrations() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, handleFilter, filters, setter, setFilters } =
        useFiltering(filtersDefaultValues);
    const { data, isLoading, refresh } = useBranchAdministrationsQuery(filters);
    const { t } = useLocale();

    const tableData = data?.data?.map(item => ({
        ...item,
        description: item.description?.[i18next.language],
        branch: item.branch?.name?.[i18next.language],
        user: item.user?.name?.[i18next.language]
    }));

    const formData = data?.data?.map(item => ({
        id: item.id,
        name: item.name,
        status: item.status
    }));

    return (
        <div>
            <Table
                title={t('table_titles.branch_administrations')}
                refresh={refresh}
                loading={isLoading}
                data={tableData}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={branchAdministrationsColumns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setter('pagination')}
                Filters={
                    <Filters filters={filters} handleFilter={handleFilter} />
                }
                setFilters={setFilters}
                filters={filters}
            />
            {isOpen.add && <CreateBranchAdministration onClose={toggle.add} />}
            {isOpen.edit && (
                <EditBranchAdministration
                    onClose={toggle.edit}
                    oldData={getOriginalObject(isOpen.edit, formData)}
                />
            )}
            {isOpen.view && (
                <ViewBranchAdministration
                    onClose={toggle.view}
                    oldData={getOriginalObject(isOpen.view, formData)}
                />
            )}
            {isOpen.delete && (
                <DeleteBranchAdministration
                    onClose={toggle.delete}
                    id={isOpen.delete?.id}
                />
            )}
        </div>
    );
}
