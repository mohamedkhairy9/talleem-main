import React from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import Cell from '@/components/common/table/cells/Cell';
import DateCell from '@/components/common/table/cells/DateCell';
import { getEvaluationTargetName, getLocalizedText, getTemplateName } from './helpers';

const columnHelper = createColumnHelper();

export const getEvaluationColumns = locale => {
    const isArabic = locale === 'ar';

    return [
    columnHelper.accessor(row => getTemplateName(row, locale), {
        id: 'template',
        header: isArabic ? 'قالب التقييم' : 'Evaluation Template',
        cell: info => <Cell value={info.getValue()} />
    }),
    columnHelper.accessor(row => getEvaluationTargetName(row, locale), {
        id: 'evaluated',
        header: isArabic ? 'المُقيَّم' : 'Evaluated User',
        cell: info => <Cell value={info.getValue()} />
    }),
    columnHelper.accessor('evaluated_type', {
        header: isArabic ? 'النوع' : 'Type',
        cell: info => <Cell value={info.getValue() || '-'} />
    }),
    columnHelper.accessor(
        row => row.total_score ?? row.score ?? row.final_score ?? row.total_grade ?? '-',
        {
            id: 'score',
            header: isArabic ? 'النتيجة' : 'Score',
            cell: info => <Cell value={info.getValue()} />
        }
    ),
    columnHelper.accessor('evaluation_date', {
        header: isArabic ? 'تاريخ التقييم' : 'Evaluation Date',
        cell: info => <DateCell value={info.getValue()} />
    })
    ];
};

export const getTemplateColumns = locale => {
    const isArabic = locale === 'ar';

    return [
    columnHelper.accessor(row => getLocalizedText(row.name, locale) || '-', {
        id: 'name',
        header: isArabic ? 'الاسم' : 'Name',
        cell: info => <Cell value={info.getValue()} />
    }),
    columnHelper.accessor(row => getLocalizedText(row.evaluation_for, locale) || '-', {
        id: 'evaluation_for',
        header: isArabic ? 'التقييم لـ' : 'Evaluation For',
        cell: info => <Cell value={info.getValue()} />
    }),
    columnHelper.accessor(row => row.criteria?.length ?? row.criteria_count ?? '-', {
        id: 'criteria_count',
        header: isArabic ? 'المعايير' : 'Criteria',
        cell: info => <Cell value={info.getValue()} />
    }),
    columnHelper.accessor('total_grade', {
        header: isArabic ? 'الدرجة الكلية' : 'Total Grade',
        cell: info => <Cell value={info.getValue() ?? '-'} />
    })
    ];
};
