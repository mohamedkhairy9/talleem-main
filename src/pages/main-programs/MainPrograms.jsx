import React from 'react';
import { useMainProgramsQuery } from '@/api/hooks/useMainPrograms';
import Table from '@/components/common/table/Table';
import { mainProgramsColumns, filtersDefaultValues } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import useFiltering from '@/utils/hooks/global/useFiltering';
import CreateMainProgram from './CreateMainProgram';
import EditMainProgram from './EditMainProgram';
import DeleteMainProgram from './DeleteMainProgram';
import useLocale from '@/utils/hooks/global/useLocale';
import i18next from 'i18next';
import { getOriginalObject } from '@/utils/helpers/global.fns';
import ViewMainProgram from './ViewMainProgram';
import Filters from './Filters';

export default function MainPrograms() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, handleFilter, filters, setter, setFilters } =
        useFiltering(filtersDefaultValues);
    const { data, isLoading, refresh } = useMainProgramsQuery(filters);
    const { t } = useLocale();

    const tableData = data?.data?.map(item => ({
        ...item,
        name: item.name?.[i18next.language]
    }));

    const formData = data?.data?.map(({ created_at, updated_at, ...item }) => item);

    return (
        <div>
            <Table
                resource="main_programs"
                title={t('table_titles.main_programs')}
                refresh={refresh}
                loading={isLoading}
                data={tableData}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={mainProgramsColumns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setter('pagination')}
                Filters={
                    <Filters filters={filters} handleFilter={handleFilter} />
                }
                setFilters={setFilters}
                filters={filters}
                enableAdd={false}
                enableEdit={false}
                enableDelete={false}
            />
            {/* {isOpen.add && <CreateMainProgram onClose={toggle.add} />}
            {isOpen.edit && (
                <EditMainProgram
                    onClose={toggle.edit}
                    oldData={getOriginalObject(isOpen.edit, data?.data)}
                />
            )} */}
            {isOpen.view && (
                <ViewMainProgram
                    onClose={toggle.view}
                    oldData={getOriginalObject(isOpen.view, formData)}
                />
            )}
            {/* {isOpen.delete && (
                <DeleteMainProgram
                    onClose={toggle.delete}
                    id={isOpen.delete?.id}
                />
            )} */}
        </div>
    );
}
