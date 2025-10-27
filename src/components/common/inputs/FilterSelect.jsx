import React from 'react';
import SimpleSelect from './SimpleSelect';

export default function FilterSelect({
    name,
    label,
    options,
    placeholder,
    onChange,
    value,
    disabled
}) {
    return (
        <SimpleSelect
            name={name}
            label={label}
            options={options}
            placeholder={placeholder}
            onChange={onChange}
            ltrPadding="0px 16px 0px 0px"
            rtlPadding="0px 0px 0px 16px"
            classes="text-sm"
            minHeight="38px"
            value={value}
            disabled={disabled}
        />
    );
}
