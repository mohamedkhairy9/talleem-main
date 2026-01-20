import React from 'react';
import { joinRequestsFilters } from './configs';
import FilterText from '@/components/common/inputs/FilterText';

export default function Filters({ filters, handleFilter }) {
    return joinRequestsFilters.map(filter =>
        filter.type === 'text' ? (
            <FilterText
                key={filter.name}
                {...filter}
                value={filters?.[filter.name] || ''}
                onChange={e => handleFilter(filter.name, e.target.value)}
            />
        ) : null
    );
}

