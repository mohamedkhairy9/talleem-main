const STATUS_PRESENTATIONS = {
    active: {
        labelKey: 'common.active',
        className: 'bg-green-100 text-green-800 border-green-200',
        dotClassName: 'bg-green-500'
    },
    inactive: {
        labelKey: 'common.inactive',
        className: 'bg-red-100 text-red-800 border-red-200',
        dotClassName: 'bg-red-500'
    },
    cancelled: {
        label: 'Cancelled',
        className: 'bg-red-100 text-red-800 border-red-200',
        dotClassName: 'bg-red-500'
    },
    canceled: {
        label: 'Canceled',
        className: 'bg-red-100 text-red-800 border-red-200',
        dotClassName: 'bg-red-500'
    },
    unauthorized: {
        label: 'Unauthorized',
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        dotClassName: 'bg-yellow-500'
    },
    suspended: {
        label: 'Suspended',
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        dotClassName: 'bg-yellow-500'
    },
    unlicensed: {
        label: 'Unlicensed',
        className: 'bg-amber-100 text-amber-800 border-amber-200',
        dotClassName: 'bg-amber-500'
    }
};

export function getStatusPresentation(status) {
    if (status === true || status === 1) {
        return {
            labelKey: 'common.enabled',
            className: 'bg-green-100 text-green-800 border-green-200',
            dotClassName: 'bg-green-500'
        };
    }

    if (status === false || status === 0) {
        return {
            labelKey: 'common.disabled',
            className: 'bg-red-100 text-red-800 border-red-200',
            dotClassName: 'bg-red-500'
        };
    }

    const key = String(status ?? '').trim().toLowerCase();

    return STATUS_PRESENTATIONS[key] || {
        label: status ? String(status) : '',
        className: 'bg-gray-100 text-gray-800 border-gray-200',
        dotClassName: 'bg-gray-500'
    };
}
