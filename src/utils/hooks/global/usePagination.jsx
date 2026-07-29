import React, { useState } from 'react';

export const DEFAULT_SERVER_SORT = {
    sort_by: 'created_at',
    sort_direction: 'desc'
};

export default function usePagination() {
    const [pagination, setPagination] = useState({
        page: 1,
        per_page: 10,
        ...DEFAULT_SERVER_SORT
    });

    const setter = (name, value) => {
        setPagination(old => ({ ...old, [name]: value }));
    };

    function setPage(value) {
        setter('page', value);
    }

    function setPerPage(value) {
        setter('per_page', value);
    }

    return {
        pagination,
        setPage,
        setPerPage,
        setPagination
    };
}
