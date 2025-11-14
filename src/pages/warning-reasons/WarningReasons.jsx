import React from 'react';
import { useWarningReasonsQuery } from '@/api/hooks/useWarningReasons';
import Table from '@/components/common/table/Table';
import { warningReasonsColumns, filtersDefaultValues } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import CreateWarningReason from './CreateWarningReason';
import EditWarningReason from './EditWarningReason';
import DeleteWarningReason from './DeleteWarningReason';
import useLocale from '@/utils/hooks/global/useLocale';
import i18next from 'i18next';
import { getOriginalObject } from '@/utils/helpers/global.fns';
import ViewWarningReason from './ViewWarningReason';
import useFiltering from '@/utils/hooks/global/useFiltering';
import Filters from './Filters';

export default function WarningReasons() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, handleFilter, filters, setter, setFilters } =
        useFiltering(filtersDefaultValues);
    const { data, isLoading, refresh } = useWarningReasonsQuery(filters);
    const { t } = useLocale();

    const tableData = data?.data?.map(item => ({
        ...item,
        description: item.name?.[i18next.language], // Changed from description to name
        program_name: item.main_program?.name?.[i18next.language]
    }));

    // Transform the data to match form expectations
    const formData = data?.data?.map(item => ({
        ...item,
        description: item.name, // Map 'name' to 'description' for form
        main_program_id: item.main_program?.id // Add main_program_id
    }));

    return (
        <div>
            <Table
                title={t('table_titles.warning_reasons')}
                refresh={refresh}
                loading={isLoading}
                data={tableData}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={warningReasonsColumns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setter('pagination')}
                Filters={
                    <Filters filters={filters} handleFilter={handleFilter} />
                }
                setFilters={setFilters}
                filters={filters}
            />
            {isOpen.add && <CreateWarningReason onClose={toggle.add} />}
            {isOpen.edit && (
                <EditWarningReason
                    onClose={toggle.edit}
                    oldData={getOriginalObject(isOpen.edit, formData)}
                />
            )}
            {isOpen.view && (
                <ViewWarningReason
                    onClose={toggle.view}
                    oldData={getOriginalObject(isOpen.view, formData)}
                />
            )}
            {isOpen.delete && (
                <DeleteWarningReason
                    onClose={toggle.delete}
                    id={isOpen.delete?.id}
                />
            )}
        </div>
    );
}