import SelectRFH from "./SelectRFH";

export default function InputRFH({
    error,
    label,
    placeholder,
    name,
    type = 'text',
    register,
    options,
    control,
    defaultValue
}) {

    if (type === 'select') {
        return <SelectRFH defaultValue={defaultValue} control={control} register={register} error={error} label={label} name={name} options={options} placeholder={placeholder} />
    }
    return (
        <div>
            {label && (
                <label
                    htmlFor={name}
                    className="block  font-medium text-gray-700 mb-1 font-montserrat"
                >
                    {label}
                </label>
            )}
            <input
                {...register(name)}
                type={type}
                className={`w-full px-4 py-3 border outline-none rounded-lg focus:border-blue-500 transition-colors duration-200 font-montserrat ${
                    error
                        ? 'border-red-300  focus:border-red-500'
                        : 'border-gray-300'
                }`}
                placeholder={placeholder || ''}
            />
            {
                <p
                    id="password-error"
                    className="mt-2 h-4 text-xs text-red-600 font-montserrat"
                    role="alert"
                >
                    {error || ''}
                </p>
            }
        </div>
    );
}
