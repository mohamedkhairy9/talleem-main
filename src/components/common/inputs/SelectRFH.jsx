import React, { useState, useEffect } from 'react';
import { Controller } from 'react-hook-form';
import Select from 'react-select';
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
    loading = false
}) {
    const { t, isRTL } = useLocale();
    const [showInfo, setShowInfo] = useState(false);
    
    const getValue = (valueToTransform, optionsList) => {
        // Use the provided options list or fall back to the options prop
        const availableOptions = optionsList || options || [];
        
        if (valueToTransform !== undefined && valueToTransform !== null) {
            if (isMulti) {
                // تأكد من أن valueToTransform هو array
                const valueArray = Array.isArray(valueToTransform) 
                    ? valueToTransform 
                    : [valueToTransform];
                
                // Normalize values - keep as strings or numbers, don't force conversion to avoid NaN issues
                const normalizedValues = valueArray.map(el => {
                    const val = el?.id !== undefined ? el.id : el?.value !== undefined ? el.value : el;
                    // Keep original type, only convert if it's actually a number string
                    return val;
                });
                
                return availableOptions
                    ?.filter(item => {
                        // Check both id and value fields
                        const itemId = item.id !== undefined ? item.id : null;
                        const itemValue = item.value !== undefined ? item.value : null;
                        
                        // Compare using strict equality - this works for both strings and numbers
                        return normalizedValues.some(normalizedVal => {
                            return normalizedVal === itemId || normalizedVal === itemValue;
                        });
                    })
                    .map(option => ({
                        value: option.value !== undefined ? option.value : option.id,
                        label: option.label || option.name
                    }));
            } else {
                // إذا كانت القيمة array في single select، خذ أول عنصر
                const singleValue = Array.isArray(valueToTransform) 
                    ? valueToTransform[0] 
                    : valueToTransform;
                
                const x = availableOptions?.find(el => {
                    // Check both id and value fields using strict equality
                    const elId = el.id !== undefined ? el.id : null;
                    const elValue = el.value !== undefined ? el.value : null;
                    
                    // Use strict equality - works for both strings and numbers
                    return (
                        (elId !== null && elId === singleValue) ||
                        (elValue !== null && elValue === singleValue)
                    );
                });
                
                return x
                    ? {
                          label: x.label || x.name,
                          value: x.value !== undefined ? x.value : x.id
                      }
                    : null;
            }
        }
        return null;
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
                    // Recalculate value whenever field.value or options change
                    const selectedValue = getValue(field.value, options);
                    
                    return (
                        <Select
                            value={selectedValue}
                            isMulti={isMulti}
                            className={`react-select ${
                                width ? width : 'w-full min-w-[300px]'
                            } ${classes || ''}`}
                            classNamePrefix="react-select"
                            options={options}
                            isDisabled={disabled}
                            isLoading={loading}
                            placeholder={loading ? t('common.loading') : t(placeholder)}
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            styles={{
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
                            }}
                            onChange={selected => {
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
                            }}
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