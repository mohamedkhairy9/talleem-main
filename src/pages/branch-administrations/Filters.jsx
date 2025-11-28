import React from 'react';
import { branchAdministrationsFilters } from './configs';
import FilterText from '@/components/common/inputs/FilterText';
import FilterSelect from '@/components/common/inputs/FilterSelect';
import { generateOptions } from '@/utils/helpers/global.fns';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function Filters({ filters, handleFilter }) {
    return branchAdministrationsFilters.map(filter => {
        if (filter.type === 'select') {
            return (
                <FilterSelect
                    key={filter.name}
                    {...filter}
                    value={filters?.[filter.name] ?? filter.defaultValue}
                    onChange={value => handleFilter(filter.name, value)}
                    options={generateOptions(enabledDisabledOptions)}
                />
            );
        }
        return (
            <FilterText
                key={filter.name}
                {...filter}
                value={filters?.[filter.name] || ''}
                onChange={e => handleFilter(filter.name, e.target.value)}
            />
        );
    });
}
