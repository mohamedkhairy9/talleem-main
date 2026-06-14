import React from 'react';
import { useGeneralHolidaysQuery } from '@/api/hooks/useGeneralHolidays';
import Table from '@/components/common/table/Table';
import { filtersDefaultValues, generalHolidaysColumns } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import useFiltering from '@/utils/hooks/global/useFiltering';
import CreateGeneralHoliday from './CreateGeneralHoliday';
import EditGeneralHoliday from './EditGeneralHoliday';
import DeleteGeneralHoliday from './DeleteGeneralHoliday';
import useLocale from '@/utils/hooks/global/useLocale';
import { getOriginalObject, onlyDate } from '@/utils/helpers/global.fns';
import ViewGeneralHoliday from './ViewGeneralHoliday';
import Filters from './Filters';

export default function GeneralHolidays() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, handleFilter, filters, setter, setFilters } =
        useFiltering(filtersDefaultValues);
    const { data, isLoading, refresh } = useGeneralHolidaysQuery(filters);
    const { t } = useLocale();

    const tableData = data?.data?.map(item => ({
        ...item
    }));

    const formData = data?.data?.map(item => ({
        ...item,
        date: onlyDate(item.date)
    }));

    return (
        <div>
            <Table
                resource="general_holidays"
                title={t('table_titles.general_holidays')}
                refresh={refresh}
                loading={isLoading}
                data={tableData}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={generalHolidaysColumns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setter('pagination')}
                Filters={
                    <Filters filters={filters} handleFilter={handleFilter} />
                }
                setFilters={setFilters}
                filters={filters}
            />
            {isOpen.add && <CreateGeneralHoliday onClose={toggle.add} />}
            {isOpen.edit && (
                <EditGeneralHoliday
                    onClose={toggle.edit}
                    oldData={getOriginalObject(isOpen.edit, formData)}
                />
            )}
            {isOpen.view && (
                <ViewGeneralHoliday
                    onClose={toggle.view}
                    oldData={getOriginalObject(isOpen.view, formData)}
                />
            )}
            {isOpen.delete && (
                <DeleteGeneralHoliday
                    onClose={toggle.delete}
                    id={isOpen.delete?.id}
                />
            )}
        </div>
    );
}
