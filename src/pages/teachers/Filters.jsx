import React from 'react';
import { teachersFilters } from './configs';
import FilterSelect from '@/components/common/inputs/FilterSelect';
import { teacherStatusOptions } from '@/utils/constants/options';
import { generateOptions } from '@/utils/helpers/global.fns';
import FilterText from '@/components/common/inputs/FilterText';

export default function Filters({ filters, handleFilter }) {
    const teacherFilterStatusOptions = teacherStatusOptions.filter(
        option => option.value !== 'unauthorized'
    );
    const teacherLicenseFilterOptions = [
        { label: { ar: 'مرخص', en: 'Licensed' }, value: 'licensed' },
        { label: { ar: 'غير مرخص', en: 'Unlicensed' }, value: 'unlicensed' }
    ];

    const options = {
        status: teacherFilterStatusOptions,
        license_filter: teacherLicenseFilterOptions
    };

    return teachersFilters.map(filter =>
        filter.type === 'select' ? (
            <FilterSelect
                key={filter.name}
                {...filter}
                value={filters?.[filter.name]}
                onChange={({ value }) => handleFilter(filter.name, value)}
                options={generateOptions(options?.[filter.name])}
                disabled={
                    filter.name === 'status' &&
                    filters?.license_filter === 'unlicensed'
                }
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
