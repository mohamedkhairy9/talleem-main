import React from 'react';
import { entitiesFilters } from './configs';
import FilterSelect from '@/components/common/inputs/FilterSelect';
import { generateOptions } from '@/utils/helpers/global.fns';
import FilterText from '@/components/common/inputs/FilterText';

const statusOptions = [
    { label: { ar: 'نشط', en: 'Active' }, value: 'active' },
    { label: { ar: 'غير نشط', en: 'Inactive' }, value: 'inactive' }
];

export default function Filters({ filters, handleFilter }) {
    const options = {
        status: statusOptions
    };

    return entitiesFilters.map(filter =>
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
