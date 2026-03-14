import React from 'react';
import { useEmployeesQuery } from '@/api/hooks/useEmployees';
import Table from '@/components/common/table/Table';
import { employeesColumns, filtersDefaultValues } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import useFiltering from '@/utils/hooks/global/useFiltering';
import CreateEmployee from './CreateEmployee';
import EditEmployee from './EditEmployee';
import DeleteEmployee from './DeleteEmployee';
import ViewEmployee from './ViewEmployee';
import useLocale from '@/utils/hooks/global/useLocale';
import i18next from 'i18next';
import { getOriginalObject } from '@/utils/helpers/global.fns';
import Filters from './Filters';
import ImportEmployee from './ImportEmployee';
import { useExportExampleFileMutation } from '@/api/hooks/useEmployees';
import useExportExample from '@/utils/hooks/global/useExportExample';

export default function Employees() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, handleFilter, filters, setter, setFilters } =
        useFiltering(filtersDefaultValues);
    const { data, isLoading, refresh } = useEmployeesQuery(filters);
    const { t } = useLocale();
    const { mutate } = useExportExampleFileMutation();
    const { handleExportExample } = useExportExample({ mutate, filename: 'employees_example.xlsx' });

    const tableData = data?.data?.map(item => ({
        ...item,
        job: {
            ...item.job,
            name: item.job?.name?.[i18next.language]
        },
        branch: {
            ...item.branch,
            name: item.branch?.name?.[i18next.language]
        }
    }));

    const formData = data?.data?.map(item => ({
        ...item,
        user_id: item.user?.id,
        job_id: item.job?.id,
        branch_id: item.branch?.id,
        entity_id: item.entity?.id,
        nationality_id: item.nationality?.id,
        academic_qualification_id: item.academic_qualification?.id,
        // specification_id: item.specification?.id,
        major_id: item.major?.id,
        city_id: item.city?.id
    }));

    return (
        <div>
            <Table
                resource="employees"
                title={t('table_titles.employees')}
                refresh={refresh}
                loading={isLoading}
                data={tableData}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={employeesColumns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setter('pagination')}
                Filters={
                    <Filters filters={filters} handleFilter={handleFilter} />
                }
                setFilters={setFilters}
                filters={filters}
                enableImport={true}
                enableExportExample={true}
                onImport={toggle.import}
                onExportExample={handleExportExample}
            />
            {isOpen.add && <CreateEmployee onClose={toggle.add} />}
            {isOpen.edit && (
                <EditEmployee
                    onClose={toggle.edit}
                    oldData={getOriginalObject(isOpen.edit, formData)}
                />
            )}
            {isOpen.view && (
                <ViewEmployee
                    onClose={toggle.view}
                    oldData={getOriginalObject(isOpen.view, data?.data ?? [])}
                />
            )}
            {isOpen.delete && (
                <DeleteEmployee
                    onClose={toggle.delete}
                    id={isOpen.delete?.id}
                />
            )}
            {isOpen.import && <ImportEmployee onClose={toggle.import} />}
        </div>
    );
}
