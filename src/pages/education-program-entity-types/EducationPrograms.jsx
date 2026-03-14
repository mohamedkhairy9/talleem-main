import React from 'react';
import { useEducationProgramEntityTypesQuery } from '@/api/hooks/useEducationProgramEntityTypes';
import Table from '@/components/common/table/Table';
import {
    educationProgramEntityTypesColumns,
    filtersDefaultValues
} from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import useFiltering from '@/utils/hooks/global/useFiltering';
import CreateEducationProgramEntityType from './CreateEducationProgramEntityType';
import EditEducationProgramEntityType from './EditEducationProgramEntityType';
import DeleteEducationProgramEntityType from './DeleteEducationProgramEntityType';
import useLocale from '@/utils/hooks/global/useLocale';
import i18next from 'i18next';
import { getOriginalObject } from '@/utils/helpers/global.fns';
import ViewEducationProgramEntityType from './ViewEducationProgramEntityType';
import Filters from './Filters';

export default function EducationPrograms() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, handleFilter, filters, setter, setFilters } =
        useFiltering(filtersDefaultValues);
    const { data, isLoading, refresh } =
        useEducationProgramEntityTypesQuery(filters);
    const { t } = useLocale();

    console.log('data', data);

    const tableData = data?.data?.map(item => ({
        ...item,
        name: item.name?.[i18next.language],
        educational_entity_classification:
            item.educational_entity_classification?.[i18next.language]
    }));

    const formData = data?.data?.map(({ created_at, updated_at, ...item }) => item);

    console.log('tableData', tableData);

    return (
        <div>
            <Table
                resource="education_program_entity_types"
                title={t('table_titles.education-program-entity-types')}
                refresh={refresh}
                loading={isLoading}
                data={tableData}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={educationProgramEntityTypesColumns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setter('pagination')}
                Filters={
                    <Filters filters={filters} handleFilter={handleFilter} />
                }
                setFilters={setFilters}
                filters={filters}
            />
            {isOpen.add && (
                <CreateEducationProgramEntityType onClose={toggle.add} />
            )}
            {isOpen.edit && (
                <EditEducationProgramEntityType
                    onClose={toggle.edit}
                    oldData={getOriginalObject(isOpen.edit, formData)}
                />
            )}
            {isOpen.view && (
                <ViewEducationProgramEntityType
                    onClose={toggle.view}
                    oldData={getOriginalObject(isOpen.view, formData)}
                />
            )}
            {isOpen.delete && (
                <DeleteEducationProgramEntityType
                    onClose={toggle.delete}
                    id={isOpen.delete?.id}
                />
            )}
        </div>
    );
}
