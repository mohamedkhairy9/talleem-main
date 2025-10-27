import { useState } from 'react';
import usePagination from './usePagination';

export default function useFiltering(defaultFilters = {}) {
    const { pagination, setPagination } = usePagination();
    const [filters, setFilters] = useState(defaultFilters);

    function handleFilter(name, value) {
        setFilters(old => ({ ...old, [name]: value }));
    }

    function setter(id) {
        if (id === 'pagination') {
            return setPagination;
        } else if (id === 'filters') {
            return setFilters;
        } else {
            return null;
        }
    }

    return {
        pagination,
        setPagination,
        filters: { ...filters, ...pagination },
        handleFilter,
        setFilters,
        setter
    };
}
