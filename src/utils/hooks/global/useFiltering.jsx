import { useState } from 'react';
import usePagination from './usePagination';

export default function useFiltering() {
    const { pagination, setPagination } = usePagination();
    const [filters, setFilters] = useState({});

    function handleFilter(name, value) {
        setFilters(old => ({ ...old, [name]: value }));
    }

    return {
        pagination,
        setPagination,
        filters,
        handleFilter
    };
}
