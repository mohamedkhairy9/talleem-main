import React from 'react';
import { warningReasonsFilters, apiCalls } from './configs';
import FilterSelect from '@/components/common/inputs/FilterSelect';
import { enabledDisabledOptions } from '@/utils/constants/options';
import { generateOptions } from '@/utils/helpers/global.fns';
import FilterText from '@/components/common/inputs/FilterText';
import useApiCalls from './useApiCalls';

export default function Filters({ filters, handleFilter }) {
    const { mainProgramsData } = useApiCalls({ apiCalls });

    const options = {
        status: enabledDisabledOptions,
        main_program_id: mainProgramsData?.data
    };

    return warningReasonsFilters.map(filter =>
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