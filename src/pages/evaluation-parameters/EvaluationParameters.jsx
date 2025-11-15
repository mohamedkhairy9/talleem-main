import React from 'react';
import { useEvaluationParametersQuery } from '@/api/hooks/useEvaluationParameters';
import Table from '@/components/common/table/Table';
import { evaluationParametersColumns, filtersDefaultValues } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import CreateEvaluationParameter from './CreateEvaluationParameter';
import EditEvaluationParameter from './EditEvaluationParameter';
import DeleteEvaluationParameter from './DeleteEvaluationParameter';
import useLocale from '@/utils/hooks/global/useLocale';
import i18next from 'i18next';
import ViewEvaluationParameter from './ViewEvaluationParameter';
import useFiltering from '@/utils/hooks/global/useFiltering';
import Filters from './Filters';
import useApiCalls from './useApiCalls';
import { apiCalls } from './configs';

export default function EvaluationParameters() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, handleFilter, filters, setter, setFilters } =
        useFiltering(filtersDefaultValues);
    const { data, isLoading, refresh } = useEvaluationParametersQuery(filters);
    const { mainProgramsData } = useApiCalls({ apiCalls });
    const { t } = useLocale();

    // Transform table data to include program name
    const tableData = data?.data?.map(item => {
        // Find the main program from the mainProgramsData
        const mainProgram = mainProgramsData?.data?.find(
            program => program.id === item.main_program_id
        );

        return {
            ...item,
            name_display: item.name?.[i18next.language],
            program_name: mainProgram?.name?.[i18next.language] || item.main_program_id,
            evaluation_for_display: item.evaluation_for?.[i18next.language]
        };
    });

    const formData = data?.data?.map(item => {
        const mainProgram = mainProgramsData?.data?.find(
            program => program.id === item.main_program_id
        );

        return {
            ...item,
            main_program: mainProgram
        };
    });

    return (
        <div>
            <Table
                title={t('table_titles.evaluation_parameters')}
                refresh={refresh}
                loading={isLoading}
                data={tableData}
                serverPagination={true}
                totalCount={data?.meta?.total}
                columns={evaluationParametersColumns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setter('pagination')}
                Filters={
                    <Filters filters={filters} handleFilter={handleFilter} />
                }
                setFilters={setFilters}
                filters={filters}
            />
            {isOpen.add && <CreateEvaluationParameter onClose={toggle.add} />}
            {isOpen.edit && (
                <EditEvaluationParameter
                    onClose={toggle.edit}
                    oldData={formData?.find(item => item.id === isOpen.edit?.id)}
                />
            )}
            {isOpen.view && (
                <ViewEvaluationParameter
                    onClose={toggle.view}
                    oldData={formData?.find(item => item.id === isOpen.view?.id)}
                />
            )}
            {isOpen.delete && (
                <DeleteEvaluationParameter
                    onClose={toggle.delete}
                    id={isOpen.delete?.id}
                />
            )}
        </div>
    );
}