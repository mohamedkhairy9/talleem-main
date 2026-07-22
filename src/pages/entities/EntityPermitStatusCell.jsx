import ActiveCell from '@/components/common/table/cells/ActiveCell';
import useLocale from '@/utils/hooks/global/useLocale';
import React from 'react';

const permittedStatuses = new Set(['active', 'authorized', 'permitted']);
const notPermittedStatuses = new Set([
    'unauthorized',
    'unlicensed',
    'not_permitted',
    'not permitted'
]);

export default function EntityPermitStatusCell({ info }) {
    const { t } = useLocale();
    const status = String(info?.getValue?.() ?? '')
        .trim()
        .toLowerCase();
    const isPermitted = permittedStatuses.has(status);
    const isNotPermitted = notPermittedStatuses.has(status);

    if (!isPermitted && !isNotPermitted) return <ActiveCell info={info} />;

    return (
        <div className="flex items-center space-x-2">
            <div
                className={`h-2 w-2 rounded-full ${
                    isPermitted ? 'bg-green-500' : 'bg-yellow-500'
                }`}
            />
            <span
                className={`inline-flex rounded-full border px-2 py-1 text-xs font-medium ${
                    isPermitted
                        ? 'border-green-200 bg-green-100 text-green-800'
                        : 'border-yellow-200 bg-yellow-100 text-yellow-800'
                }`}
            >
                {t(
                    isPermitted
                        ? 'entity_permit.status.permitted'
                        : 'entity_permit.status.not_permitted'
                )}
            </span>
        </div>
    );
}
