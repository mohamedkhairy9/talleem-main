import React from 'react';
import { certificateNamesFilters } from './configs';
import FilterSelect from '@/components/common/inputs/FilterSelect';
import { enabledDisabledOptions } from '@/utils/constants/options';
import { generateOptions } from '@/utils/helpers/global.fns';
import FilterText from '@/components/common/inputs/FilterText';
import useApiCalls from './useApiCalls';
import { API_KEYS } from '@/api/endpoints';

export default function Filters({ filters, handleFilter }) {
    const { mainProgramsData } = useApiCalls({
        apiCalls: [API_KEYS.MAIN_PROGRAMS]
    });

    const options = {
        status: enabledDisabledOptions,
        main_program_id: [{ id: '', name: 'الكل' }, ...(mainProgramsData?.data || [])]
    };

    return certificateNamesFilters.map(filter =>
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
