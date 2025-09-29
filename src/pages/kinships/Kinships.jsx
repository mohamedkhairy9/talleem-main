import React from 'react';
import { useKinshipsQuery } from '@/api/hooks/useKinships';
import Table from '@/components/common/table/Table';
import { kinshipsColumns } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import usePagination from '@/utils/hooks/global/usePagination';
import CreateKinship from './CreateKinship';
import EditKinship from './EditKinship';
import DeleteKinship from './DeleteKinship';
import useLocale from '@/utils/hooks/global/useLocale';

export default function Kinships() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, setPagination } = usePagination();
    const { data, isLoading, refresh } = useKinshipsQuery(pagination);
    const { t } = useLocale();

    return (
        <div>
            <Table
                title={t('table_titles.kinships')}
                refresh={refresh}
                loading={isLoading}
                data={data?.data}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={kinshipsColumns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setPagination}
            />
            {isOpen.add && <CreateKinship onClose={toggle.add} />}
            {isOpen.edit && (
                <EditKinship onClose={toggle.edit} oldData={isOpen.edit} />
            )}
            {isOpen.delete && (
                <DeleteKinship onClose={toggle.delete} id={isOpen.delete?.id} />
            )}
        </div>
    );
}
