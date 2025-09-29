import React from 'react';
import { useEducationProgramEntityTypesQuery } from '@/api/hooks/useEducationProgramEntityTypes';
import Table from '@/components/common/table/Table';
import { educationProgramEntityTypesColumns } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import usePagination from '@/utils/hooks/global/usePagination';
import CreateEducationProgramEntityType from './CreateEducationProgramEntityType';
import EditEducationProgramEntityType from './EditEducationProgramEntityType';
import DeleteEducationProgramEntityType from './DeleteEducationProgramEntityType';

export default function EducationPrograms() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, setPagination } = usePagination();
    const { data, isLoading, refresh } =
        useEducationProgramEntityTypesQuery(pagination);

    return (
        <div>
            <Table
                title="Education Programs"
                refresh={refresh}
                loading={isLoading}
                data={data?.data}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={educationProgramEntityTypesColumns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setPagination}
            />
            {isOpen.add && (
                <CreateEducationProgramEntityType onClose={toggle.add} />
            )}
            {isOpen.edit && (
                <EditEducationProgramEntityType
                    onClose={toggle.edit}
                    oldData={isOpen.edit}
                />
            )}
            {isOpen.delete && (
                <DeleteEducationProgramEntityType
                    onClose={toggle.delete}
                    id={isOpen.delete?.id}
                />
            )}
        </div>
    );
}
