import React, { useMemo, useState } from 'react';
import Table from '@/components/common/table/Table';
import useFiltering from '@/utils/hooks/global/useFiltering';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import useLocale from '@/utils/hooks/global/useLocale';
import {
    useEvaluationsQuery,
    useReceivedEvaluationsQuery
} from '@/api/hooks/useEvaluations';
import { useEvaluationParametersQuery } from '@/api/hooks/useEvaluationParameters';
import { getEvaluationColumns, getTemplateColumns } from './configs';
import { extractCollection, resolveTotalCount } from './helpers';
import CreateEvaluation from './CreateEvaluation';
import ViewEvaluation from './ViewEvaluation';

const defaultFilters = {};

export default function Evaluations() {
    const { currentLocale } = useLocale();
    const isArabic = currentLocale === 'ar';
    const { isOpen, toggle } = useIsOpen();
    const { pagination, filters, setter, setPagination } = useFiltering(defaultFilters);
    const [activeTab, setActiveTab] = useState('sent');

    const evaluationsQuery = useEvaluationsQuery(filters, {
        enabled: activeTab === 'sent'
    });
    const receivedQuery = useReceivedEvaluationsQuery(filters, {
        enabled: activeTab === 'received'
    });
    const evaluationParametersQuery = useEvaluationParametersQuery(
        { page: pagination.page, per_page: pagination.per_page },
        { enabled: activeTab === 'templates' }
    );
    const sourceQuery =
        activeTab === 'received'
            ? receivedQuery
            : activeTab === 'templates'
                ? evaluationParametersQuery
                : evaluationsQuery;
    const sourceData = sourceQuery.data;
    const allTableData = extractCollection(sourceData);
    const isTemplatesTab = activeTab === 'templates';
    const columns = useMemo(
        () =>
            isTemplatesTab
                ? getTemplateColumns(currentLocale)
                : getEvaluationColumns(currentLocale),
        [currentLocale, isTemplatesTab]
    );
    const totalCount = resolveTotalCount(sourceData, allTableData.length);
    const tableData =
        isTemplatesTab &&
        totalCount > pagination.per_page &&
        allTableData.length >= totalCount
            ? allTableData.slice(
                  (pagination.page - 1) * pagination.per_page,
                  pagination.page * pagination.per_page
              )
            : allTableData;

    const changeTab = tab => {
        setActiveTab(tab);
        setPagination(previous => ({ ...previous, page: 1 }));
    };

    const tabs = [
        { id: 'sent', label: isArabic ? 'التقييمات' : 'Evaluations' },
        { id: 'received', label: isArabic ? 'التقييمات المستلمة' : 'Received' },
        { id: 'templates', label: isArabic ? 'قوالب التقييم' : 'Templates' }
    ];

    return (
        <div>
            <div className="mb-5 flex flex-wrap gap-2">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => changeTab(tab.id)}
                        className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                            activeTab === tab.id
                                ? 'bg-primary text-white'
                                : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <Table
                resource="evaluation_parameters"
                title={isArabic ? 'إدارة التقييمات' : 'Evaluations Management'}
                refresh={sourceQuery.refresh}
                loading={sourceQuery.isLoading}
                data={tableData}
                serverPagination={true}
                totalCount={totalCount}
                columns={columns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setter('pagination')}
                enableAdd={!isTemplatesTab && activeTab === 'sent'}
                enableEdit={false}
                enableDelete={false}
                enableCopy={false}
                enableView={!isTemplatesTab}
            />

            {isOpen.add && <CreateEvaluation onClose={toggle.add} />}
            {isOpen.view && (
                <ViewEvaluation onClose={toggle.view} evaluation={isOpen.view} />
            )}
        </div>
    );
}
