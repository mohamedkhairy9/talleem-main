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
import { normalizeSelectedIds } from './employeeJobPolicy';
import { useUserStore } from '@/utils/stores/user.store';
import {
    filterProfilesByBranch,
    getBranchManagerAssignedBranchId,
    isBranchManagerScopedUser
} from '@/utils/helpers/branchManagerScope';

export default function Employees() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, handleFilter, filters, setter, setFilters } =
        useFiltering(filtersDefaultValues);
    const currentUser = useUserStore(state => state.user);
    const isBranchManager = isBranchManagerScopedUser(currentUser);
    const assignedBranchId = getBranchManagerAssignedBranchId(currentUser);
    const canLoadProfiles = !isBranchManager || Boolean(assignedBranchId);
    const scopedFilters = React.useMemo(
        () =>
            isBranchManager
                ? {
                      ...filters,
                      branch_id: assignedBranchId
                  }
                : filters,
        [assignedBranchId, filters, isBranchManager]
    );
    const { data, isLoading, refresh } = useEmployeesQuery(scopedFilters, {
        enabled: canLoadProfiles
    });
    const { t } = useLocale();
    const { mutate } = useExportExampleFileMutation();
    const { handleExportExample } = useExportExample({ mutate, filename: 'employees_example.xlsx' });

    const getLocalizedBranchesName = item => {
        const branches = Array.isArray(item.branches)
            ? item.branches
            : item.branch
              ? [item.branch]
              : [];

        return branches
            .map(branch => branch?.name?.[i18next.language] || branch?.name?.en || branch?.name?.ar || branch?.name)
            .filter(Boolean)
            .join(', ');
    };

    const sourceData = data?.data ?? [];
    const scopedData = isBranchManager
        ? filterProfilesByBranch(sourceData, assignedBranchId)
        : sourceData;

    const tableData = scopedData.map(item => ({
        ...item,
        job: {
            ...item.job,
            name: item.job?.name?.[i18next.language]
        },
        branch: {
            ...item.branch,
            name: getLocalizedBranchesName(item)
        }
    }));

    const formData = scopedData.map(item => ({
        ...item,
        user_id: item.user?.id,
        job_id: item.job?.id,
        branch_id: normalizeSelectedIds(
            item.branches ?? item.branch ?? item.branch_id
        ),
        branches: Array.isArray(item.branches)
            ? item.branches
            : item.branch
              ? [item.branch]
              : [],
        entity_id: normalizeSelectedIds(
            item.entities ?? item.entity ?? item.entity_id
        ),
        entities: Array.isArray(item.entities)
            ? item.entities
            : item.entity
              ? [item.entity]
              : [],
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
                totalCount={data?.meta?.total ?? scopedData.length}
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
                    oldData={getOriginalObject(isOpen.view, formData)}
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
