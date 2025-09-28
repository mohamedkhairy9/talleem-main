import React from 'react';
import { Controller } from 'react-hook-form';
import Select from 'react-select';

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
    placeholder = 'Please select ..'
}) {
    const getDefaultValue = () => {
        if (defaultValue) {
            if (isMulti) {
                return options
                    ?.filter(item =>
                        defaultValue
                            ?.map(el => el.id || el.value || el)
                            .includes(item.id || item.value)
                    )
                    .map(option => ({
                        value: option.id || option.value,
                        label: option.name || option.label
                    }));
            } else {
                const x = options?.find(
                    el =>
                        Number(el.id) === Number(defaultValue) ||
                        el.value === defaultValue
                );
                return x
                    ? { label: x.name || x.label, value: x.id || x.value }
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
                    className="block  font-medium text-gray-700 mb-1 font-montserrat"
                >
                    {label}
                </label>
            )}
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <Select
                        defaultValue={getDefaultValue()}
                        isMulti={isMulti}
                        className={`react-select ${
                            width ? width : 'w-full min-w-[300px]'
                        } ${classes || ''}`}
                        classNamePrefix="react-select"
                        options={options}
                        isDisabled={disabled}
                        placeholder={placeholder}
                        styles={{
                            control: (provided, state) => ({
                                ...provided,
                                padding: '6px 16px',
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
                            })
                        }}
                        onChange={selected => {
                            const newValue = isMulti
                                ? selected.map(
                                      option => option.value || option.id
                                  )
                                : selected?.value || selected?.id;

                            field.onChange(newValue);
                        }}
                    />
                )}
            />
            <p
                className="mt-2 h-4 text-xs text-red-600 font-montserrat"
                role="alert"
            >
                {error || ''}
            </p>
        </div>
    );
}
