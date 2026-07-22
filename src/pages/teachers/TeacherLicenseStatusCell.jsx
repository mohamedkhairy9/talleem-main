import ActiveCell from '@/components/common/table/cells/ActiveCell';
import useLocale from '@/utils/hooks/global/useLocale';
import React from 'react';

const licensedStatuses = new Set(['active', 'licensed']);
const notLicensedStatuses = new Set([
    'unauthorized',
    'unlicensed',
    'not_licensed',
    'not licensed'
]);

export default function TeacherLicenseStatusCell({ info }) {
    const { t } = useLocale();
    const status = String(info?.getValue?.() ?? '')
        .trim()
        .toLowerCase();
    const isLicensed = licensedStatuses.has(status);
    const isNotLicensed = notLicensedStatuses.has(status);

    if (!isLicensed && !isNotLicensed) return <ActiveCell info={info} />;

    return (
        <div className="flex items-center space-x-2">
            <div
                className={`h-2 w-2 rounded-full ${
                    isLicensed ? 'bg-green-500' : 'bg-amber-500'
                }`}
            />
            <span
                className={`inline-flex rounded-full border px-2 py-1 text-xs font-medium ${
                    isLicensed
                        ? 'border-green-200 bg-green-100 text-green-800'
                        : 'border-amber-200 bg-amber-100 text-amber-800'
                }`}
            >
                {t(
                    isLicensed
                        ? 'teacher_license.status.licensed'
                        : 'teacher_license.status.not_licensed'
                )}
            </span>
        </div>
    );
}
