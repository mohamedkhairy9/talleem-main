import React, { useState, useEffect, useRef } from 'react';
import SimpleInput from './SimpleInput';
import useDebounce from '@/utils/hooks/global/useDebounce';

export default function FilterText({
    name,
    label,
    placeholder,
    defaultValue,
    onChange,
    value,
    debounceDelay = 500
}) {
    const [inputValue, setInputValue] = useState(value || defaultValue || '');
    const debouncedValue = useDebounce(inputValue, debounceDelay);
    const onChangeRef = useRef(onChange);
    const isInitialMount = useRef(true);
    const isUserTyping = useRef(false);
    const prevDebouncedValueRef = useRef(inputValue);
    const inputValueRef = useRef(inputValue);

    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    useEffect(() => {
        inputValueRef.current = inputValue;
    }, [inputValue]);

    useEffect(() => {
        if (
            !isUserTyping.current &&
            value !== undefined &&
            value !== inputValueRef.current
        ) {
            setInputValue(value);
            prevDebouncedValueRef.current = value;
        }
    }, [value]);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            prevDebouncedValueRef.current = debouncedValue;
            return;
        }

        if (
            onChangeRef.current &&
            debouncedValue !== undefined &&
            debouncedValue !== prevDebouncedValueRef.current &&
            isUserTyping.current
        ) {
            prevDebouncedValueRef.current = debouncedValue;
            const syntheticEvent = {
                target: {
                    value: debouncedValue,
                    name: name
                }
            };
            onChangeRef.current(syntheticEvent);
            isUserTyping.current = false;
        } else if (debouncedValue !== prevDebouncedValueRef.current) {
            prevDebouncedValueRef.current = debouncedValue;
        }
    }, [debouncedValue, name]);

    const handleChange = e => {
        isUserTyping.current = true;
        setInputValue(e.target.value);
    };

    return (
        <SimpleInput
            name={name}
            label={label}
            placeholder={placeholder}
            defaultValue={defaultValue}
            onChange={handleChange}
            value={inputValue}
            padding="px-4 py-2"
            hideError={true}
            textSize="text-sm"
        />
    );
}
