import React, { useState } from 'react';

export default function usePagination() {
    const [pagination, setPagination] = useState({
        page: 1,
        per_page: 10
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
