import useLocale from '@/utils/hooks/global/useLocale';
import React from 'react';
import Select from 'react-select';
export default function SimpleSelect({
    defaultValue,
    isMulti,
    options,
    width,
    classes,
    placeholder,
    disabled,
    error,
    onChange,
    value,
    rtlPadding = '6px 0px 6px 16px',
    ltrPadding = '6px 16px 6px 0px',
    minHeight = '44px'
}) {
    const { t, isRTL } = useLocale();
    const getDefaultValue = () => {
        if (defaultValue !== undefined && defaultValue !== null) {
            if (isMulti) {
                return options
                    ?.filter(item =>
                        defaultValue
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
                            Number(el.id) === Number(defaultValue)) ||
                        el.value === defaultValue
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

    function getValue() {
        if (value !== undefined && value !== null) {
            if (isMulti) {
                return options?.filter(option => value.includes(option.value));
            } else {
                return options?.find(option => option.value === value);
            }
        }
        return null;
    }

    return (
        <div>
            <Select
                value={getValue()}
                defaultValue={getDefaultValue()}
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
                        padding: !isRTL ? rtlPadding : ltrPadding,
                        minHeight: minHeight,
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
                    })
                }}
                onChange={onChange}
            />
        </div>
    );
}
