import React from 'react';
import { inspectorAssignmentsFilters } from './configs';
import FilterSelect from '@/components/common/inputs/FilterSelect';
import { enabledDisabledOptions } from '@/utils/constants/options';
import { generateOptions } from '@/utils/helpers/global.fns';
import FilterText from '@/components/common/inputs/FilterText';
import useApiCalls from './useApiCalls';
import { API_KEYS } from '@/api/endpoints';

export default function Filters({ filters, handleFilter }) {
    const { branchesData } = useApiCalls({
        apiCalls: [API_KEYS.BRANCHES]
    });

    const assignmentTypeOptions = [
        { id: '', name: 'الكل' },
        { id: 'regular', name: 'إشراف تربوي اعتيادي' },
        { id: 'committee', name: 'تشكيل لجنة إشراف' }
    ];

    const options = {
        status: enabledDisabledOptions,
        assignment_type: assignmentTypeOptions,
        branch_id: [{ id: '', name: 'الكل' }, ...(branchesData?.data || [])]
    };

    return inspectorAssignmentsFilters.map(filter =>
        filter.type === 'select' ? (
            <FilterSelect
                key={filter.name}
                {...filter}
                value={filters?.[filter.name]}
                onChange={({ value }) => handleFilter(filter.name, value)}
                options={generateOptions(options?.[filter.name])}
            />
        ) : (
            <FilterText
                key={filter.name}
                {...filter}
                value={filters?.[filter.name] || ''}
                onChange={e => handleFilter(filter.name, e.target.value)}
            />
        )
    );
}
