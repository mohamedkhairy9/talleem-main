import React from 'react';
import { warningsFilters } from './configs';
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

    const warningTypeOptions = [
        { id: '', name: 'الكل' },
        { id: 'student', name: 'إنذار طالب' },
        { id: 'teacher', name: 'إنذار معلم' },
        { id: 'entity', name: 'إنذار جهة' }
    ];

    const options = {
        status: enabledDisabledOptions,
        warning_type: warningTypeOptions,
        branch_id: [{ id: '', name: 'الكل' }, ...(branchesData?.data || [])]
    };

    return warningsFilters.map(filter =>
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
