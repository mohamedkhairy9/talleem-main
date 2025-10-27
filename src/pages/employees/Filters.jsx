import React from 'react';
import { employeesFilters } from './configs';
import FilterSelect from '@/components/common/inputs/FilterSelect';
import { enabledDisabledOptions } from '@/utils/constants/options';
import { generateOptions } from '@/utils/helpers/global.fns';
import FilterText from '@/components/common/inputs/FilterText';

export default function Filters({ filters, handleFilter }) {
    const options = {
        status: enabledDisabledOptions.map(option => ({
            label: option.label,
            value: option.value ? 1 : 0
        }))
    };

    return employeesFilters.map(filter =>
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
