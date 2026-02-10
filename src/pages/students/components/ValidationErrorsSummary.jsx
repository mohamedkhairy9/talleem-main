import useLocale from '@/utils/hooks/global/useLocale';

export default function ValidationErrorsSummary({ errors }) {
    const { t } = useLocale();

    if (!errors || Object.keys(errors).length === 0) return null;

    return (
        <div className="mx-4 mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="text-red-700 font-semibold mb-2 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {t('validation.please_fix_errors')}
            </h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-red-600">
                {Object.entries(errors).map(([key, value]) => {
                    if (typeof value === 'object' && !value.message) {
                        return Object.entries(value).map(([nestedKey, nestedValue]) => (
                            <li key={`${key}.${nestedKey}`}>
                                {t(`validation.${key}.${nestedKey}.label`)}: {nestedValue?.message ? t(nestedValue.message) : t('validation.field_required')}
                            </li>
                        ));
                    }
                    return (
                        <li key={key}>
                            {t(`validation.${key}.label`)}: {value?.message ? t(value.message) : t('validation.field_required')}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

