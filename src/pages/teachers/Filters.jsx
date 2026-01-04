import React from 'react';
import { teachersFilters } from './configs';
import FilterSelect from '@/components/common/inputs/FilterSelect';
import { teacherStatusOptions } from '@/utils/constants/options';
import { generateOptions } from '@/utils/helpers/global.fns';
import FilterText from '@/components/common/inputs/FilterText';

export default function Filters({ filters, handleFilter }) {
    const options = {
        status: teacherStatusOptions
    };

    return teachersFilters.map(filter =>
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
