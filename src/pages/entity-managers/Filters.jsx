import React from 'react';
import { entityManagersFilters } from './configs';
import FilterText from '@/components/common/inputs/FilterText';

export default function Filters({ filters, handleFilter }) {
    return entityManagersFilters.map(filter => (
        <FilterText
            key={filter.name}
            {...filter}
            value={filters?.[filter.name] || ''}
            onChange={e => handleFilter(filter.name, e.target.value)}
        />
    ));
}
