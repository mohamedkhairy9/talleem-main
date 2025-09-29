import React from 'react';
import { useQuoranPartsQuery } from '@/api/hooks/useQuoranParts';
import Table from '@/components/common/table/Table';
import { quoranPartsColumns } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import usePagination from '@/utils/hooks/global/usePagination';
import CreateQuoranPart from './CreateQuoranPart';
import EditQuoranPart from './EditQuoranPart';
import DeleteQuoranPart from './DeleteQuoranPart';
import useLocale from '@/utils/hooks/global/useLocale';

export default function QuranParts() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, setPagination } = usePagination();
    const { data, isLoading, refresh } = useQuoranPartsQuery(pagination);
    const { t } = useLocale();

    return (
        <div>
            <Table
                title={t('table_titles.quoran_parts')}
                refresh={refresh}
                loading={isLoading}
                data={data?.data}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={quoranPartsColumns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setPagination}
            />
            {isOpen.add && <CreateQuoranPart onClose={toggle.add} />}
            {isOpen.edit && (
                <EditQuoranPart onClose={toggle.edit} oldData={isOpen.edit} />
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
