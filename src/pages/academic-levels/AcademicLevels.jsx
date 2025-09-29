import React from 'react';
import { useAcademicLevelsQuery } from '@/api/hooks/useAcademicLevels';
import Table from '@/components/common/table/Table';
import { academicLevelsColumns } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import usePagination from '@/utils/hooks/global/usePagination';
import CreateAcademicLevel from './CreateAcademicLevel';
import EditAcademicLevel from './EditAcademicLevel';
import DeleteAcademicLevel from './DeleteAcademicLevel';

export default function AcademicLevels() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, setPagination } = usePagination();
    const { data, isLoading, refresh } = useAcademicLevelsQuery(pagination);

    return (
        <div>
            <Table
                title="Academic Levels"
                refresh={refresh}
                loading={isLoading}
                data={data?.data}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={academicLevelsColumns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setPagination}
            />
            {isOpen.add && <CreateAcademicLevel onClose={toggle.add} />}
            {isOpen.edit && (
                <EditAcademicLevel
                    onClose={toggle.edit}
                    oldData={isOpen.edit}
                />
            )}
            {isOpen.delete && (
                <DeleteAcademicLevel
                    onClose={toggle.delete}
                    id={isOpen.delete?.id}
                />
            )}
        </div>
    );
}
