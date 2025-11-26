import React from 'react';
import { useExamSegmentsCountQuery } from '@/api/hooks/useExamSegmentsCount';
import Table from '@/components/common/table/Table';
import { examSegmentsCountColumns, filtersDefaultValues } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import useFiltering from '@/utils/hooks/global/useFiltering';
import CreateExamSegmentsCount from './CreateExamSegmentsCount';
import EditExamSegmentsCount from './EditExamSegmentsCount';
import DeleteExamSegmentsCount from './DeleteExamSegmentsCount';
import ViewExamSegmentsCount from './ViewExamSegmentsCount';
import useLocale from '@/utils/hooks/global/useLocale';
import { getOriginalObject } from '@/utils/helpers/global.fns';
import Filters from './Filters';

export default function ExamSegmentsCount() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, handleFilter, filters, setter, setFilters } =
        useFiltering(filtersDefaultValues);
    const { data, isLoading, refresh } = useExamSegmentsCountQuery(filters);
    const { t } = useLocale();

    const tableData = data?.data;

    const formData = data?.data?.map(item => ({
        id: item.id,
        parts_count: item.parts_count,
        segments_required: item.segments_required,
        is_active: item.is_active
    }));

    return (
        <div>
            <Table
                title={t('table_titles.exam_segments_count')}
                refresh={refresh}
                loading={isLoading}
                data={tableData}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={examSegmentsCountColumns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setter('pagination')}
                Filters={
                    <Filters filters={filters} handleFilter={handleFilter} />
                }
                setFilters={setFilters}
                filters={filters}
            />
            {isOpen.add && <CreateExamSegmentsCount onClose={toggle.add} />}
            {isOpen.edit && (
                <EditExamSegmentsCount
                    onClose={toggle.edit}
                    oldData={getOriginalObject(isOpen.edit, formData)}
                />
            )}
            {isOpen.view && (
                <ViewExamSegmentsCount
                    onClose={toggle.view}
                    oldData={getOriginalObject(isOpen.view, formData)}
                />
            )}
            {isOpen.delete && (
                <DeleteExamSegmentsCount
                    onClose={toggle.delete}
                    id={isOpen.delete?.id}
                />
            )}
        </div>
    );
}