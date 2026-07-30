import { useEffect, useState } from 'react';
import useLocale from '@/utils/hooks/global/useLocale';
import { localizeMessage } from '@/utils/helpers/localizedMessages';

const PARTS = ['first', 'father', 'grandfather', 'family'];

const splitFullName = value => {
    const words = String(value || '')
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    return {
        first: words[0] || '',
        father: words[1] || '',
        grandfather: words[2] || '',
        family: words.slice(3).join(' ')
    };
};

const joinFullName = parts =>
    PARTS.map(part => String(parts[part] || '').trim())
        .filter(Boolean)
        .join(' ');

/**
 * Captures the four components of a person's name while preserving the
 * backend contract: { name: { ar: string, en: string } }.
 */
export default function FourPartNameInput({
    name,
    label,
    placeholder,
    value,
    setValue,
    register,
    error,
    disabled = false,
    required = false
}) {
    const { t } = useLocale();
    const [parts, setParts] = useState(() => splitFullName(value));

    useEffect(() => {
        setParts(splitFullName(value));
    }, [name, value]);

    const handlePartChange = (part, nextValue) => {
        const nextParts = { ...parts, [part]: nextValue };
        setParts(nextParts);
        setValue(name, joinFullName(nextParts), {
            shouldDirty: true,
            shouldValidate: true
        });
    };

    const isArabic = name.endsWith('.ar');

    return (
        <div className="w-full md:col-span-2 lg:col-span-3">
            <label className="mb-1 block font-medium text-gray-700">
                {t(label)}
                {required && <span className="ml-1 text-red-500">*</span>}
            </label>

            <input type="hidden" {...register(name)} />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {PARTS.map(part => (
                    <div key={part}>
                        <label htmlFor={`${name}-${part}`} className="mb-1 block text-sm text-gray-600">
                            {t(`validation.full_name.parts.${part}`)}
                        </label>
                        <input
                            id={`${name}-${part}`}
                            type="text"
                            value={parts[part]}
                            onChange={event => handlePartChange(part, event.target.value)}
                            disabled={disabled}
                            required={required && !disabled}
                            dir={isArabic ? 'rtl' : 'ltr'}
                            placeholder={t(placeholder) || ''}
                            className={`w-full rounded-lg border px-3 py-3 outline-none transition-colors duration-200 focus:border-accent ${
                                error ? 'border-red-300 focus:border-red-500' : 'border-gray-300'
                            } ${disabled ? 'bg-gray-100 text-gray-700' : ''}`}
                        />
                    </div>
                ))}
            </div>

            <p className="mt-1 h-4 text-xs text-red-600" role="alert">
                {error ? localizeMessage(error, 'api.errors.validation', { preferFallbackForEnglish: true }) : ''}
            </p>
        </div>
    );
}
