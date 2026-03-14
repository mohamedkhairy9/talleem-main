import React from 'react';
import { useWarningsQuery } from '@/api/hooks/useWarnings';
import Table from '@/components/common/table/Table';
import { warningsColumns, filtersDefaultValues } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import CreateWarning from './CreateWarning';
import EditWarning from './EditWarning';
import DeleteWarning from './DeleteWarning';
import useLocale from '@/utils/hooks/global/useLocale';
import { getOriginalObject } from '@/utils/helpers/global.fns';
import ViewWarning from './ViewWarning';
import useFiltering from '@/utils/hooks/global/useFiltering';
import Filters from './Filters';

export default function IssuingWarnings() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, handleFilter, filters, setter, setFilters } =
        useFiltering(filtersDefaultValues);
    const { data, isLoading, refresh } = useWarningsQuery(filters);
    const { t } = useLocale();

    const tableData = data?.data;

    const formData = data?.data?.map(item => ({
        ...item,
        program_id: item.program?.id,
        branch_id: item.branch?.id,
        entity_id: item.entity?.id,
        student_id: item.student?.id || null,
        teacher_id: item.teacher?.id || null,
        warning_reason_id: item.warning_reason?.id
    }));

    return (
        <div>
            <Table
                resource="warnings"
                title={t('table_titles.warnings')}
                refresh={refresh}
                loading={isLoading}
                data={tableData}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={warningsColumns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setter('pagination')}
                Filters={
                    <Filters filters={filters} handleFilter={handleFilter} />
                }
                setFilters={setFilters}
                filters={filters}
            />
            {isOpen.add && <CreateWarning onClose={toggle.add} />}
            {isOpen.edit && (
                <EditWarning
                    onClose={toggle.edit}
                    oldData={getOriginalObject(isOpen.edit, formData)}
                />
            )}
            {isOpen.view && (
                <ViewWarning
                    onClose={toggle.view}
                    oldData={getOriginalObject(isOpen.view, data?.data ?? [])}
                />
            )}
            {isOpen.delete && (
                <DeleteWarning
                    onClose={toggle.delete}
                    id={isOpen.delete?.id}
                />
            )}
        </div>
    );
}
