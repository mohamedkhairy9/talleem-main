import React from 'react';
import { certificatesFilters } from './configs';
import { issuedFromOptions } from '@/pages/certification-names/configs';
import FilterSelect from '@/components/common/inputs/FilterSelect';
import { generateOptions } from '@/utils/helpers/global.fns';
import FilterText from '@/components/common/inputs/FilterText';
import { useBranchesQuery } from '@/api/hooks/useBranches';
import { allData } from '@/utils/constants/global.constants';

export default function Filters({ filters, handleFilter }) {
    const { data: branchesData } = useBranchesQuery(allData);

    const options = {
        branch_id: branchesData?.data,
        issued_from: issuedFromOptions
    };

    return certificatesFilters.map(filter =>
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
