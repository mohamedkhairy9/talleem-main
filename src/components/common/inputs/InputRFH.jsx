import useLocale from '@/utils/hooks/global/useLocale';
import SelectRFH from './SelectRFH';
import { shouldUseAsyncSelect, createLoadOptionsForField, getDefaultOptionsForField } from '@/utils/helpers/asyncSelectFieldMapper';
import { useMemo } from 'react';
import i18next from 'i18next';

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
    loading = false,
    isAsync = false,
    loadOptions = null,
    defaultOptions = false,
    cacheOptions = true,
    oldData = null,
    fieldParams = {}
}) {
    const { t } = useLocale();

    // Auto-detect if field should use async select (if not explicitly set and field is API-backed)
    const asyncConfig = useMemo(() => {
        // If explicitly set, use that
        if (isAsync !== false || loadOptions !== null) {
            return {
                isAsync: isAsync || !!loadOptions,
                loadOptions,
                defaultOptions
            };
        }
        
        // Auto-detect for select fields that are API-backed
        // Always use async for API-backed fields to enable pagination (ignore options prop)
        if (type === 'select' && shouldUseAsyncSelect(name)) {
            // Get the option object from oldData if available
            const fieldValue = oldData?.[name];
            let includeOption = null;
            
            // Try to get the full object
            const fieldObjectName = name.replace('_id', '');
            const fieldObject = oldData?.[fieldObjectName] || null;
            
            if (fieldObject && typeof fieldObject === 'object' && fieldObject.id) {
                includeOption = fieldObject;
            } else if (fieldValue && typeof fieldValue === 'object' && fieldValue.id) {
                includeOption = fieldValue;
            }
            
            const asyncLoadOptions = createLoadOptionsForField(
                name,
                fieldParams[name] || {},
                includeOption
            );
            
            const asyncDefaultOptions = getDefaultOptionsForField(
                name,
                oldData,
                i18next.language
            );
            
            return {
                isAsync: true,
                loadOptions: asyncLoadOptions,
                defaultOptions: asyncDefaultOptions
            };
        }
        
        return {
            isAsync: false,
            loadOptions: null,
            defaultOptions: false
        };
    }, [type, name, isAsync, loadOptions, defaultOptions, oldData, fieldParams]);

    // Select input returns early
    if (type === 'select') {
        // Build props - completely separate async and regular props
        if (asyncConfig.isAsync && asyncConfig.loadOptions) {
            // ASYNC SELECT - No options prop at all
            return (
                <SelectRFH
                    info={info}
                    defaultValue={defaultValue}
                    control={control}
                    register={register}
                    error={error}
                    label={label}
                    name={name}
                    disabled={disabled}
                    placeholder={placeholder}
                    isMulti={isMulti}
                    required={required}
                    loading={loading}
                    isAsync={true}
                    loadOptions={asyncConfig.loadOptions}
                    defaultOptions={asyncConfig.defaultOptions}
                    cacheOptions={cacheOptions}
                />
            );
        }
        
        // REGULAR SELECT - Include options
        return (
            <SelectRFH
                info={info}
                defaultValue={defaultValue}
                control={control}
                register={register}
                error={error}
                label={label}
                name={name}
                options={Array.isArray(options) ? options : []}
                disabled={disabled}
                placeholder={placeholder}
                isMulti={isMulti}
                required={required}
                loading={loading}
                isAsync={false}
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
