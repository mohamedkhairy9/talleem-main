import React from 'react';
import { useMainProgramsQuery } from '@/api/hooks/useMainPrograms';
import Table from '@/components/common/table/Table';
import { mainProgramsColumns } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import usePagination from '@/utils/hooks/global/usePagination';
import CreateMainProgram from './CreateMainProgram';
import EditMainProgram from './EditMainProgram';
import DeleteMainProgram from './DeleteMainProgram';
import useLocale from '@/utils/hooks/global/useLocale';

export default function MainPrograms() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, setPagination } = usePagination();
    const { data, isLoading, refresh } = useMainProgramsQuery(pagination);
    const { t } = useLocale();

    return (
        <div>
            <Table
                title={t('table_titles.main_programs')}
                refresh={refresh}
                loading={isLoading}
                data={data?.data}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={mainProgramsColumns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setPagination}
            />
            {isOpen.add && <CreateMainProgram onClose={toggle.add} />}
            {isOpen.edit && (
                <EditMainProgram onClose={toggle.edit} oldData={isOpen.edit} />
            )}
            {isOpen.delete && (
                <DeleteMainProgram
                    onClose={toggle.delete}
                    id={isOpen.delete?.id}
                />
            )}
        </div>
    );
}
