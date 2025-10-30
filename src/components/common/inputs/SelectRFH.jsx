import React, { useState } from 'react';
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
    info = ''
}) {
    const { t, isRTL } = useLocale();
    const [showInfo, setShowInfo] = useState(false);
    const getValue = valueToTransform => {
        if (valueToTransform !== undefined && valueToTransform !== null) {
            if (isMulti) {
                return options
                    ?.filter(item =>
                        valueToTransform
                            ?.map(el =>
                                el.id !== undefined
                                    ? el.id
                                    : el.value !== undefined
                                    ? el.value
                                    : el
                            )
                            .includes(
                                item.id !== undefined ? item.id : item.value
                            )
                    )
                    .map(option => ({
                        value:
                            option.id !== undefined ? option.id : option.value,
                        label: option.name || option.label
                    }));
            } else {
                const x = options?.find(
                    el =>
                        (el.id !== undefined &&
                            Number(el.id) === Number(valueToTransform)) ||
                        el.value === valueToTransform
                );
                return x
                    ? {
                          label: x.name || x.label,
                          value: x.id !== undefined ? x.id : x.value
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
                    <span>{t(label)}</span>

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
                defaultValue={getValue(defaultValue)}
                render={({ field }) => (
                    <Select
                        value={getValue(field.value)}
                        isMulti={isMulti}
                        className={`react-select ${
                            width ? width : 'w-full min-w-[300px]'
                        } ${classes || ''}`}
                        classNamePrefix="react-select"
                        options={options}
                        isDisabled={disabled}
                        placeholder={t(placeholder)}
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
                )}
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
