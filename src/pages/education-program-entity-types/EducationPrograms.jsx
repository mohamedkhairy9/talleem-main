import React from 'react';
import { useEducationProgramEntityTypesQuery } from '@/api/hooks/useEducationProgramEntityTypes';
import Table from '@/components/common/table/Table';
import { educationProgramEntityTypesColumns } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import usePagination from '@/utils/hooks/global/usePagination';
import CreateEducationProgramEntityType from './CreateEducationProgramEntityType';
import EditEducationProgramEntityType from './EditEducationProgramEntityType';
import DeleteEducationProgramEntityType from './DeleteEducationProgramEntityType';
import useLocale from '@/utils/hooks/global/useLocale';
import i18next from 'i18next';
import { getOriginalObject } from '@/utils/helpers/global.fns';
import ViewEducationProgramEntityType from './ViewEducationProgramEntityType';

export default function EducationPrograms() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, setPagination } = usePagination();
    const { data, isLoading, refresh } =
        useEducationProgramEntityTypesQuery(pagination);
    const { t } = useLocale();

    console.log('data', data);

    const tableData = data?.data?.map(item => ({
        ...item,
        name: item.name?.[i18next.language],
        educational_entity_classification:
            item.educational_entity_classification?.[i18next.language]
    }));

    console.log('tableData', tableData);

    return (
        <div>
            <Table
                title={t('table_titles.education_programs')}
                refresh={refresh}
                loading={isLoading}
                data={tableData}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={educationProgramEntityTypesColumns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setPagination}
            />
            {isOpen.add && (
                <CreateEducationProgramEntityType onClose={toggle.add} />
            )}
            {isOpen.edit && (
                <EditEducationProgramEntityType
                    onClose={toggle.edit}
                    oldData={getOriginalObject(isOpen.edit, data?.data)}
                />
            )}
            {isOpen.view && (
                <ViewEducationProgramEntityType
                    onClose={toggle.view}
                    oldData={getOriginalObject(isOpen.view, data?.data)}
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
