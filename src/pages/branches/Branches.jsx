import React from 'react';
import { useBranchesQuery } from '@/api/hooks/useBranches';
import Table from '@/components/common/table/Table';
import { branchesColumns } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import usePagination from '@/utils/hooks/global/usePagination';
import CreateBranch from './CreateBranch';
import EditBranch from './EditBranch';
import DeleteBranch from './DeleteBranch';
import useLocale from '@/utils/hooks/global/useLocale';
import i18next from 'i18next';
import { getOriginalObject } from '@/utils/helpers/global.fns';
import ViewBranch from './ViewBranch';

export default function Branches() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, setPagination } = usePagination();
    const { data, isLoading, refresh } = useBranchesQuery(pagination);
    const { t } = useLocale();

    const tableData = data?.data?.map(item => ({
        ...item,
        name: item.name?.[i18next.language]
    }));

    const formData = data?.data?.map(item => ({
        ...item,
        city_id: item.city.id,
        neighborhood_id: item.neighborhood.id
    }));

    return (
        <div>
            <Table
                title={t('table_titles.branches')}
                refresh={refresh}
                loading={isLoading}
                data={tableData}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={branchesColumns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setPagination}
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
