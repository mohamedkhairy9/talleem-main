import React from 'react';
import { useMemorizationProgramEntityTypesQuery } from '@/api/hooks/useMemorizationProgramEntityTypes';
import Table from '@/components/common/table/Table';
import { memorizationProgramEntityTypesColumns } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import usePagination from '@/utils/hooks/global/usePagination';
import CreateMemorizationProgramEntityType from './CreateMemorizationProgramEntityType';
import EditMemorizationProgramEntityType from './EditMemorizationProgramEntityType';
import DeleteMemorizationProgramEntityType from './DeleteMemorizationProgramEntityType';
import useLocale from '@/utils/hooks/global/useLocale';
import i18next from 'i18next';
import { getOriginalObject } from '@/utils/helpers/global.fns';

export default function MemorizationPrograms() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, setPagination } = usePagination();
    const { data, isLoading, refresh } =
        useMemorizationProgramEntityTypesQuery(pagination);
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
                setPagination={setPagination}
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
            {isOpen.delete && (
                <DeleteMemorizationProgramEntityType
                    onClose={toggle.delete}
                    id={isOpen.delete?.id}
                />
            )}
        </div>
    );
}
