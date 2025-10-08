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
    p = 'px-4 py-3'
}) {
    const { t } = useLocale();

    if (type === 'select') {
        return (
            <SelectRFH
                defaultValue={defaultValue}
                control={control}
                register={register}
                error={error}
                label={label}
                name={name}
                options={options}
                placeholder={placeholder}
            />
        );
    }

    return (
        <div>
            {label && (
                <label
                    htmlFor={name}
                    className="block font-medium text-gray-700 mb-1 "
                >
                    {t(label)}
                </label>
            )}
            <input
                {...register(name)}
                type={type}
                id={name || ''}
                className={`w-full ${p} border outline-none rounded-lg focus:border-accent transition-colors duration-200  ${
                    error
                        ? 'border-red-300  focus:border-red-500'
                        : 'border-gray-300'
                }`}
                placeholder={t(placeholder) || ''}
            />
            {
                <p
                    id="password-error"
                    className="mt-1 h-4 text-xs text-red-600 "
                    role="alert"
                >
                    {t(error) || ''}
                </p>
            }
        </div>
    );
}
