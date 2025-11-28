import React from 'react';
import { useInspectorAssignmentsQuery } from '@/api/hooks/useInspectorAssignments';
import Table from '@/components/common/table/Table';
import { inspectorAssignmentsColumns, filtersDefaultValues } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import EditInspectorAssignment from './EditInspectorAssignment';
import DeleteInspectorAssignment from './DeleteInspectorAssignment';
import useLocale from '@/utils/hooks/global/useLocale';
import { getOriginalObject } from '@/utils/helpers/global.fns';
import ViewInspectorAssignment from './ViewInspectorAssignment';
import useFiltering from '@/utils/hooks/global/useFiltering';
import Filters from './Filters';
import CreateInspectorAssignment from './Createinspectorassignment';

export default function InspectorAssignments() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, handleFilter, filters, setter, setFilters } =
        useFiltering(filtersDefaultValues);
    const { data, isLoading, refresh } = useInspectorAssignmentsQuery(filters);
    const { t } = useLocale();

    const tableData = data?.data;

    const formData = data?.data?.map(item => ({
        ...item,
        main_program_id: item.main_program?.id,
        branch_id: item.branch?.id,
        entity_ids: item.supervisors?.flatMap(s => s.entities?.map(e => e.id)) || [],
        supervisor_ids: item.supervisors?.map(s => s.id) || []
    }));

    return (
        <div>
            <Table
                title={t('table_titles.inspector_assignments')}
                refresh={refresh}
                loading={isLoading}
                data={tableData}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={inspectorAssignmentsColumns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setter('pagination')}
                Filters={
                    <Filters filters={filters} handleFilter={handleFilter} />
                }
                setFilters={setFilters}
                filters={filters}
            />
            {isOpen.add && <CreateInspectorAssignment onClose={toggle.add} />}
            {isOpen.edit && (
                <EditInspectorAssignment
                    onClose={toggle.edit}
                    oldData={getOriginalObject(isOpen.edit, formData)}
                />
            )}
            {isOpen.view && (
                <ViewInspectorAssignment
                    onClose={toggle.view}
                    oldData={getOriginalObject(isOpen.view, formData)}
                />
            )}
            {isOpen.delete && (
                <DeleteInspectorAssignment
                    onClose={toggle.delete}
                    id={isOpen.delete?.id}
                />
            )}
        </div>
    );
}