import React from 'react';
import { useAcademicQualificationsQuery } from '@/api/hooks/useAcademicQualifications';
import Table from '@/components/common/table/Table';
import { academicQualificationsColumns } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import usePagination from '@/utils/hooks/global/usePagination';
import CreateAcademicQualification from './CreateAcademicQualification';
import EditAcademicQualification from './EditAcademicQualification';
import DeleteAcademicQualification from './DeleteAcademicQualification';

export default function AcademicQualifications() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, setPagination } = usePagination();
    const { data, isLoading, refresh } = useAcademicQualificationsQuery(pagination);

    return (
        <div>
            <Table
                title="Academic Qualifications"
                refresh={refresh}
                loading={isLoading}
                data={data?.data}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={academicQualificationsColumns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setPagination}
            />
            {isOpen.add && (
                <CreateAcademicQualification isOpen={isOpen.add} onClose={toggle.add} />
            )}
            {isOpen.edit && (
                <EditAcademicQualification
                    isOpen={isOpen.edit}
                    onClose={toggle.edit}
                    oldData={isOpen.edit}
                />
            )}
            {isOpen.delete && (
                <DeleteAcademicQualification onClose={toggle.delete} id={isOpen.delete?.id} />
            )}
        </div>
    );
}
