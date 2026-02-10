import React, { useState, useEffect } from 'react';
import { Controller } from 'react-hook-form';
import Select from 'react-select';
import { AsyncPaginate } from 'react-select-async-paginate';
import useLocale from '@/utils/hooks/global/useLocale';
import { FaInfoCircle } from 'react-icons/fa';
import Modal from '../form/Modal';

export default function SelectRFH({
    label,
    name,
    control,
    error,
    options,
    isMulti = false,
    disabled = false,
    width,
    defaultValue,
    classes,
    placeholder = 'Please select ..',
    info = '',
    required = false,
    loading = false,
    // Async props
    isAsync = false,
    loadOptions = null,
    defaultOptions = false,
    cacheOptions = true
}) {
    // For async selects, ensure options is completely ignored
    // If isAsync is true, options should not be used at all
    const safeOptions = isAsync ? undefined : (Array.isArray(options) ? options : []);
    
    // Debug: Log if options is being passed to async select (should not happen)
    if (isAsync && options !== undefined && process.env.NODE_ENV === 'development') {
        console.warn(`SelectRFH: options prop passed to async select for field "${name}". This should not happen.`);
    }
    const { t, isRTL } = useLocale();
    const [showInfo, setShowInfo] = useState(false);
    const [asyncSelectedOption, setAsyncSelectedOption] = useState(null);

    // Load selected option for async selects
    useEffect(() => {
        if (isAsync && loadOptions && defaultValue !== undefined && defaultValue !== null) {
            if (Array.isArray(defaultOptions)) {
                const found = defaultOptions.find(opt => 
                    (opt.value !== undefined && opt.value === defaultValue) ||
                    (opt.id !== undefined && opt.id === defaultValue)
                );
                if (found) {
                    setAsyncSelectedOption(found);
                }
            } else if (defaultOptions === true && loadOptions) {
                // Load first page to find the selected value
                loadOptions('', []).then(result => {
                    const found = result?.options?.find(opt => 
                        (opt.value !== undefined && opt.value === defaultValue) ||
                        (opt.id !== undefined && opt.id === defaultValue)
                    );
                    if (found) {
                        setAsyncSelectedOption(found);
                    }
                }).catch(() => {
                    // Ignore errors
                });
            }
        }
    }, [isAsync, defaultValue, loadOptions, defaultOptions]);

    const getValue = (valueToTransform, optionsList) => {
        const availableOptions = Array.isArray(optionsList) ? optionsList : [];
        
        if (valueToTransform !== undefined && valueToTransform !== null) {
            if (isMulti) {
                const valueArray = Array.isArray(valueToTransform) 
                    ? valueToTransform 
                    : [valueToTransform];
                
                const normalizedValues = valueArray.map(el => {
                    return el?.id !== undefined ? el.id : el?.value !== undefined ? el.value : el;
                });
                
                return availableOptions
                    .filter(item => {
                        const itemId = item.id !== undefined ? item.id : null;
                        const itemValue = item.value !== undefined ? item.value : null;
                        return normalizedValues.some(normalizedVal => {
                            return normalizedVal === itemId || normalizedVal === itemValue;
                        });
                    })
                    .map(option => ({
                        value: option.value !== undefined ? option.value : option.id,
                        label: option.label || option.name
                    }));
            } else {
                const singleValue = Array.isArray(valueToTransform) 
                    ? valueToTransform[0] 
                    : valueToTransform;
                
                const found = availableOptions.find(el => {
                    const elId = el.id !== undefined ? el.id : null;
                    const elValue = el.value !== undefined ? el.value : null;
                    return (
                        (elId !== null && elId === singleValue) ||
                        (elValue !== null && elValue === singleValue)
                    );
                });
                
                return found
                    ? {
                          label: found.label || found.name,
                          value: found.value !== undefined ? found.value : found.id
                      }
                    : null;
            }
        }
        return null;
    };

    const sharedStyles = {
        control: (provided, state) => ({
            ...provided,
            padding: !isRTL
                ? '6px 0px 6px 16px'
                : '6px 16px 6px 0px',
            minHeight: '44px',
            borderRadius: '8px',
            boxShadow: state.isFocused
                ? '0 0 0 3px rgba(59, 130, 246, 0.1)'
                : 'none',
            '&:hover': {
                borderColor: ''
            },
            borderColor: error ? '#ef4444' : '#d1d5db'
        }),
        valueContainer: provided => ({
            ...provided,
            padding: '0'
        }),
        input: provided => ({
            ...provided,
            margin: '0',
            padding: '0'
        }),
        placeholder: provided => ({
            ...provided,
            margin: '0',
            color: '#9ca3af'
        }),
        menuPortal: provided => ({
            ...provided,
            zIndex: 9999
        }),
        singleValue: (provided, state) => ({
            ...provided,
            color: state.isDisabled
                ? '#000000'
                : provided.color
        })
    };

    const handleChange = (selected, field, isAsyncSelect = false) => {
        const newValue = isMulti
            ? selected.map(option =>
                  option.value !== undefined
                      ? option.value
                      : option.id
              )
            : selected?.value !== undefined
            ? selected?.value
            : selected?.id;

        field.onChange(newValue);
        
        // For async selects, immediately update the selected option state
        // so the field displays the selected value
        if (isAsyncSelect) {
            setAsyncSelectedOption(selected);
        }
    };

    return (
        <div className="flex flex-col gap-px">
            {label && (
                <label
                    htmlFor={name}
                    className="flex items-center gap-2 font-medium text-gray-700 mb-1 font-montserrat"
                >
                    <span>
                        {t(label)}
                        {required && <span className="text-red-500 ml-1">*</span>}
                    </span>

                    {info && (
                        <FaInfoCircle
                            className="text-blue-500 cursor-pointer text-xl "
                            onClick={() => setShowInfo(true)}
                        />
                    )}
                </label>
            )}
            <Controller
                name={name}
                control={control}
                defaultValue={defaultValue}
                render={({ field }) => {
                    // Update async selected option when field value changes (e.g., from form reset or external update)
                    useEffect(() => {
                        if (isAsync && field.value !== undefined && field.value !== null) {
                            // Check if current asyncSelectedOption matches the field value
                            const currentValue = asyncSelectedOption?.value !== undefined ? asyncSelectedOption.value : asyncSelectedOption?.id;
                            if (currentValue !== field.value) {
                                // Value changed, try to find it in defaultOptions
                                if (Array.isArray(defaultOptions)) {
                                    const found = defaultOptions.find(opt => 
                                        (opt.value !== undefined && opt.value === field.value) ||
                                        (opt.id !== undefined && opt.id === field.value)
                                    );
                                    if (found) {
                                        setAsyncSelectedOption(found);
                                    } else if (loadOptions) {
                                        // If not found in defaultOptions, try loading it via loadOptions
                                        loadOptions('', [], { page: 1 }).then(result => {
                                            const found = result?.options?.find(opt => 
                                                (opt.value !== undefined && opt.value === field.value) ||
                                                (opt.id !== undefined && opt.id === field.value)
                                            );
                                            if (found) {
                                                setAsyncSelectedOption(found);
                                            }
                                        }).catch(() => {
                                            // Ignore errors
                                        });
                                    }
                                }
                            }
                        } else if (isAsync && (field.value === undefined || field.value === null)) {
                            // Clear selection when value is cleared
                            setAsyncSelectedOption(null);
                        }
                    }, [field.value, isAsync, defaultOptions, loadOptions, asyncSelectedOption]);

                    // ASYNC SELECT - Using AsyncPaginate for proper pagination support
                    if (isAsync && loadOptions) {
                        return (
                            <AsyncPaginate
                                value={asyncSelectedOption || null}
                                isMulti={isMulti}
                                className={`react-select ${
                                    width ? width : 'w-full min-w-[300px]'
                                } ${classes || ''}`}
                                classNamePrefix="react-select"
                                isDisabled={disabled}
                                isLoading={loading}
                                placeholder={loading ? t('common.loading') : t(placeholder)}
                                menuPortalTarget={document.body}
                                menuPosition="fixed"
                                styles={sharedStyles}
                                onChange={(selected) => handleChange(selected, field, true)}
                                loadOptions={loadOptions}
                                defaultOptions={defaultOptions === false ? false : (defaultOptions === true ? true : (Array.isArray(defaultOptions) ? defaultOptions : true))}
                            />
                        );
                    }

                    // REGULAR SELECT - Use options prop
                    const selectedValue = getValue(field.value, safeOptions);
                    
                    return (
                        <Select
                            value={selectedValue}
                            isMulti={isMulti}
                            className={`react-select ${
                                width ? width : 'w-full min-w-[300px]'
                            } ${classes || ''}`}
                            classNamePrefix="react-select"
                            isDisabled={disabled}
                            isLoading={loading}
                            placeholder={loading ? t('common.loading') : t(placeholder)}
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            styles={sharedStyles}
                            onChange={(selected) => handleChange(selected, field)}
                            options={safeOptions || []}
                        />
                    );
                }}
            />
            <p
                className="mt-1 h-4 text-xs text-red-600 font-montserrat"
                role="alert"
            >
                {t(error) || ''}
            </p>
            {showInfo && (
                <Modal onClose={() => setShowInfo(false)}>
                    <div className="p-4 flex flex-col gap-4 items-center justify-center bg-white rounded-lg">
                        <FaInfoCircle className="text-blue-500 text-5xl " />
                        <h3 className="text-lg font-semibold text-gray-800">
                            {t(info)}
                        </h3>
                    </div>
                </Modal>
            )}
        </div>
    );
}

