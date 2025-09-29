import React from 'react';
import { useEntityCategoriesQuery } from '@/api/hooks/useEntityCategories';
import Table from '@/components/common/table/Table';
import { entityCategoriesColumns } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import usePagination from '@/utils/hooks/global/usePagination';
import CreateEntityCategory from './CreateEntityCategory';
import EditEntityCategory from './EditEntityCategory';
import DeleteEntityCategory from './DeleteEntityCategory';

export default function EntityCategories() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, setPagination } = usePagination();
    const { data, isLoading, refresh } = useEntityCategoriesQuery(pagination);

    return (
        <div>
            <Table
                title="Entity Categories"
                refresh={refresh}
                loading={isLoading}
                data={data?.data}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={entityCategoriesColumns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setPagination}
            />
            {isOpen.add && <CreateEntityCategory onClose={toggle.add} />}
            {isOpen.edit && (
                <EditEntityCategory
                    onClose={toggle.edit}
                    oldData={isOpen.edit}
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
