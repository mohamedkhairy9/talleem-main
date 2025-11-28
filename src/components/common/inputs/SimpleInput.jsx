import useLocale from '@/utils/hooks/global/useLocale';

export default function SimpleInput({
    onChange,
    value,
    error,
    label,
    placeholder,
    name,
    type = 'text',
    padding = 'px-4 py-3',
    hideError = false,
    textSize = '',
    width = 'w-full min-w-[300px]'
}) {
    const { t } = useLocale();
    return (
        <div>
            {label && (
                <label
                    htmlFor={name}
                    className="block text-sm font-medium text-gray-700 mb-1 font-montserrat"
                >
                    {t(label)}
                </label>
            )}
            <input
                value={value}
                onChange={onChange}
                type={type}
                className={`${width} ${padding} ${textSize} border outline-none rounded-lg focus:border-primary-500 transition-colors duration-200 font-montserrat ${
                    error
                        ? 'border-red-300  focus:border-red-500'
                        : 'border-gray-300'
                }`}
                placeholder={t(placeholder) || ''}
            />
            {!hideError && (
                <p
                    id="password-error"
                    className="mt-1 h-4 text-xs text-red-600 font-montserrat"
                    role="alert"
                >
                    {t(error) || ''}
                </p>
            )}
        </div>
    );
}
