import React from 'react';
import { useEntityManagersQuery, useExportExampleFileMutation } from '@/api/hooks/useEntityManagers';
import Table from '@/components/common/table/Table';
import { entityManagersColumns, filtersDefaultValues } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import useFiltering from '@/utils/hooks/global/useFiltering';
import CreateEntityManager from './CreateEntityManager';
import EditEntityManager from './EditEntityManager';
import DeleteEntityManager from './DeleteEntityManager';
import ViewEntityManager from './ViewEntityManager';
import useLocale from '@/utils/hooks/global/useLocale';
import i18next from 'i18next';
import { getOriginalObject, onlyDate } from '@/utils/helpers/global.fns';
import Filters from './Filters';
import ImportEntityMangers from './ImportEntityMangers';
import useExportExample from '@/utils/hooks/global/useExportExample';

export default function EntityManagers() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, handleFilter, filters, setter, setFilters } =
        useFiltering(filtersDefaultValues);
    const { data, isLoading, refresh } = useEntityManagersQuery(filters);
    const { t } = useLocale();
    const { mutate } = useExportExampleFileMutation();
    const { handleExportExample } = useExportExample({ mutate, filename: 'entity_mangers_example.xlsx' });

    const tableData = data?.data?.map(item => ({
        ...item,
        name: item.name?.[i18next.language],
        entity: item.entity?.name?.[i18next.language],
    }));

    const formData = data?.data?.map(({ city, branch, entity, main_program, nationality, user, major, major_id, date_of_birth, created_at, updated_at, ...item }) => ({
        ...item,
        entity_id: entity?.id,
        nationality_id: nationality?.id,
        branch_id: branch?.id || entity?.branch?.id,
        city_id: city?.id,
        user_id: user?.id,
        date_of_birth: onlyDate(date_of_birth),
        main_program_id: main_program?.id,
        status: +user.status,
        // major_id can be either an object with id or already an id
        major_id: major?.id || (major_id?.id !== undefined ? major_id.id : major_id),
        // academic_qualification_id is already a number in the API response, keep it as is
        academic_qualification_id: item.academic_qualification_id
    }));

    return (
        <div>
            <Table
                enableAdd={true}
                enableDelete={true}
                title={t('table_titles.entity_managers')}
                refresh={refresh}
                loading={isLoading}
                data={tableData}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={entityManagersColumns}
                toggleModals={toggle}
                pagination={pagination}
                enableImport={true}
                enableExportExample={true}
                onExportExample={handleExportExample}
                onImport={toggle.import}
                setPagination={setter('pagination')}
                Filters={
                    <Filters filters={filters} handleFilter={handleFilter} />
                }
                setFilters={setFilters}
                filters={filters}
            />
            {isOpen.add && <CreateEntityManager onClose={toggle.add} />}
            {isOpen.edit && (
                <EditEntityManager
                    onClose={toggle.edit}
                    oldData={getOriginalObject(isOpen.edit, formData)}
                />
            )}
            {isOpen.view && (
                <ViewEntityManager
                    onClose={toggle.view}
                    oldData={getOriginalObject(isOpen.view, formData)}
                />
            )}
            {isOpen.delete && (
                <DeleteEntityManager
                    onClose={toggle.delete}
                    id={isOpen.delete?.id}
                />
            )}
            {isOpen.import && <ImportEntityMangers onClose={toggle.import} />}

        </div>
    );
}
