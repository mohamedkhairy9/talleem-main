import React from 'react';
import { useSpecificationsQuery } from '@/api/hooks/useSpecifications';
import Table from '@/components/common/table/Table';
import { specificationsColumns } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import usePagination from '@/utils/hooks/global/usePagination';
import CreateSpecification from './CreateSpecification';
import EditSpecification from './EditSpecification';
import DeleteSpecification from './DeleteSpecification';
import useLocale from '@/utils/hooks/global/useLocale';

export default function Specifications() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, setPagination } = usePagination();
    const { data, isLoading, refresh } = useSpecificationsQuery(pagination);
    const { t } = useLocale();

    return (
        <div>
            <Table
                title={t('table_titles.specifications')}
                refresh={refresh}
                loading={isLoading}
                data={data?.data}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={specificationsColumns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setPagination}
            />
            {isOpen.add && <CreateSpecification onClose={toggle.add} />}
            {isOpen.edit && (
                <EditSpecification
                    onClose={toggle.edit}
                    oldData={isOpen.edit}
                />
            )}
            {isOpen.delete && (
                <DeleteSpecification
                    onClose={toggle.delete}
                    id={isOpen.delete?.id}
                />
            )}
        </div>
    );
}
