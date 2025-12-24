import useLocale from '@/utils/hooks/global/useLocale';
import SelectRFH from './SelectRFH';

export default function InputRFH({
    error,
    label,
    placeholder,
    name,
    type = 'text',
    register,
    options,
    control,
    defaultValue,
    p = 'px-4 py-3',
    onChange,
    disabled,
    accept,
    isMulti = false,
    info = '',
    min,
    max,
    required = false,
    loading = false
}) {
    const { t } = useLocale();

    // Select input returns early
    if (type === 'select') {
        return (
            <SelectRFH
                info={info}
                defaultValue={defaultValue}
                control={control}
                register={register}
                error={error}
                label={label}
                name={name}
                options={options}
                disabled={disabled}
                placeholder={placeholder}
                isMulti={isMulti}
                required={required}
                loading={loading}
            />
        );
    }

    // Handle file input merging onChange
    const getInputProps = () => {
        const registered = register(name);

        if (type === 'file' && onChange) {
            return {
                ...registered,
                onChange: e => {
                    registered.onChange(e);
                    onChange(e);
                }
            };
        }

        return registered;
    };

    const isCheck = type === 'checkbox' || type === 'radio';

    return (
        <div className="w-full">
            {/* For normal inputs show label on top */}
            {label && !isCheck && (
                <label
                    htmlFor={name}
                    className="block font-medium text-gray-700 mb-1"
                >
                    {t(label)}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            {/* Checkbox & Radio */}
            {isCheck ? (
                <label
                    htmlFor={name}
                    className="flex items-center gap-2 cursor-pointer select-none"
                >
                    <input
                        {...getInputProps()}
                        type={type}
                        id={name}
                        disabled={disabled}
                        className={`border rounded focus:border-accent transition-colors duration-200 
                            ${error ? 'border-red-300 focus:border-red-500' : 'border-gray-300'}
                        `}
                    />
                    <span className="text-gray-700">
                        {t(label)}
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </span>
                </label>
            ) : (
                <>
                    {/* Normal input */}
                    {type !== 'textarea' && (
                        <input
                            {...getInputProps()}
                            type={type}
                            id={name}
                            defaultValue={defaultValue}
                            className={`w-full ${p} border outline-none rounded-lg focus:border-accent transition-colors duration-200 
                                ${error ? 'border-red-300 focus:border-red-500' : 'border-gray-300'}
                            `}
                            placeholder={t(placeholder) || ''}
                            disabled={disabled}
                            accept={accept}
                            min={min}
                            max={max}
                        />
                    )}

                    {/* Textarea */}
                    {type === 'textarea' && (
                        <textarea
                            {...register(name)}
                            id={name}
                            defaultValue={defaultValue}
                            disabled={disabled}
                            className={`w-full ${p} border outline-none rounded-lg focus:border-accent transition-colors duration-200 
                                ${error ? 'border-red-300 focus:border-red-500' : 'border-gray-300'}
                            `}
                            placeholder={t(placeholder) || ''}
                        />
                    )}
                </>
            )}

            {/* Error message */}
            <p className="mt-1 h-4 text-xs text-red-600">
                {t(error) || ''}
            </p>
        </div>
    );
}
