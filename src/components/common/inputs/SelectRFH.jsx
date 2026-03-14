import React, { useState, useEffect } from 'react';
import { Controller } from 'react-hook-form';
import Select from 'react-select';
import { AsyncPaginate } from 'react-select-async-paginate';
import useLocale from '@/utils/hooks/global/useLocale';
import { FaInfoCircle } from 'react-icons/fa';
import Modal from '../form/Modal';

// ─── Shared styles ────────────────────────────────────────────────────────────

function buildStyles(error, isRTL) {
    return {
        control: (base, state) => ({
            ...base,
            padding: isRTL ? '6px 16px 6px 0px' : '6px 0px 6px 16px',
            minHeight: '44px',
            borderRadius: '8px',
            borderColor: error ? '#ef4444' : '#d1d5db',
            boxShadow: state.isFocused ? '0 0 0 3px rgba(59,130,246,0.1)' : 'none',
            '&:hover': { borderColor: '' }
        }),
        valueContainer: base => ({ ...base, padding: '0' }),
        input:          base => ({ ...base, margin: '0', padding: '0' }),
        placeholder:    base => ({ ...base, margin: '0', color: '#9ca3af' }),
        menuPortal:     base => ({ ...base, zIndex: 9999 }),
        singleValue:    (base, state) => ({
            ...base,
            color: state.isDisabled ? '#000000' : base.color
        })
    };
}

// ─── Async inner component (hooks at top level, not inside render prop) ───────

function AsyncSelect({
    field,
    loadOptions,
    isMulti,
    disabled,
    loading,
    placeholder,
    t,
    styles,
    defaultValue,
    getOptionByValue
}) {
    const [selected, setSelected] = useState(null);

    // Resolve the displayed option when the stored value (an ID or array of IDs) changes
    useEffect(() => {
        const raw = field.value ?? defaultValue;
        if (raw == null || raw === '') {
            setSelected(null);
            return;
        }
        const ids = Array.isArray(raw) ? raw : [raw];
        if (ids.length === 0) {
            setSelected(isMulti ? [] : null);
            return;
        }
        // If already showing the correct option(s), skip
        const currentIds = Array.isArray(selected)
            ? selected.map(o => o?.value ?? o?.id).filter(Boolean)
            : selected != null ? [selected?.value ?? selected?.id] : [];
        if (ids.length === currentIds.length && ids.every((id, i) => String(currentIds[i]) === String(id))) return;

        if (getOptionByValue) {
            Promise.all(ids.map(id => getOptionByValue(id)))
                .then(opts => {
                    const resolved = opts.filter(Boolean);
                    setSelected(isMulti ? resolved : resolved[0] ?? null);
                })
                .catch(() => {});
        } else {
            loadOptions('', [], { page: 1 })
                .then(res => {
                    const options = res?.options ?? [];
                    const resolved = ids.map(id => options.find(o => o.value === id || o.id === id)).filter(Boolean);
                    setSelected(isMulti ? resolved : resolved[0] ?? null);
                })
                .catch(() => {});
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [field.value, defaultValue, isMulti]);

    function handleChange(opt) {
        const value = isMulti
            ? (opt ?? []).map(o => o.value ?? o.id)
            : (opt?.value ?? opt?.id ?? null);
        field.onChange(value);
        setSelected(opt ?? null);
    }

    return (
        <AsyncPaginate
            /*
             * defaultOptions={true}  ← CRITICAL:
             *   Tells the library to call loadOptions on first open.
             *   Never pass an array here — doing so pre-fills the internal cache
             *   and the library never calls loadOptions, so scroll pagination never fires.
             *
             * additional={{ page: 1 }}  ← initial pagination state.
             *   The library passes this as the 3rd arg on first call,
             *   then passes back whatever `additional` we returned last time.
             */
            value={selected}
            isMulti={isMulti}
            isDisabled={disabled}
            isLoading={loading}
            placeholder={loading ? t('common.loading') : t(placeholder)}
            loadOptions={loadOptions}
            additional={{ page: 1 }}
            defaultOptions={true}
            menuPortalTarget={document.body}
            menuPosition="fixed"
            styles={styles}
            classNamePrefix="react-select"
            onChange={handleChange}
        />
    );
}

// ─── Regular (static) select ──────────────────────────────────────────────────

function normalizeValue(raw, optionsList, isMulti) {
    const list = Array.isArray(optionsList) ? optionsList : [];
    if (raw == null) return isMulti ? [] : null;

    const toOpt = item => item
        ? { value: item.value ?? item.id, label: item.label || item.name }
        : null;

    if (isMulti) {
        const ids = (Array.isArray(raw) ? raw : [raw]).map(v => v?.id ?? v?.value ?? v);
        return list.filter(o => ids.includes(o.id ?? o.value)).map(toOpt);
    }

    const id = Array.isArray(raw) ? raw[0] : raw;
    const found = list.find(o => (o.id ?? o.value) === (id?.id ?? id?.value ?? id));
    return toOpt(found);
}

// ─── Public component ─────────────────────────────────────────────────────────

export default function SelectRFH({
    label,
    name,
    control,
    error,
    options,
    isMulti      = false,
    disabled     = false,
    width,
    defaultValue,
    classes,
    placeholder  = 'Please select ..',
    info         = '',
    required     = false,
    loading      = false,
    isAsync      = false,
    loadOptions  = null,
    getOptionByValue = null
}) {
    const { t, isRTL } = useLocale();
    const [showInfo, setShowInfo] = useState(false);
    const styles   = buildStyles(error, isRTL);
    const safeOpts = Array.isArray(options) ? options : [];

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
                            className="text-blue-500 cursor-pointer text-xl"
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
                    if (isAsync && loadOptions) {
                        return (
                            <AsyncSelect
                                field={field}
                                loadOptions={loadOptions}
                                isMulti={isMulti}
                                disabled={disabled}
                                loading={loading}
                                placeholder={placeholder}
                                t={t}
                                styles={styles}
                                defaultValue={defaultValue}
                                getOptionByValue={getOptionByValue}
                            />
                        );
                    }

                    // Static select
                    return (
                        <Select
                            value={normalizeValue(field.value, safeOpts, isMulti)}
                            isMulti={isMulti}
                            className={`react-select ${width || 'w-full min-w-[300px]'} ${classes || ''}`}
                            classNamePrefix="react-select"
                            isDisabled={disabled}
                            isLoading={loading}
                            placeholder={loading ? t('common.loading') : t(placeholder)}
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            styles={styles}
                            options={safeOpts}
                            onChange={opt => {
                                const value = isMulti
                                    ? (opt ?? []).map(o => o.value ?? o.id)
                                    : (opt?.value ?? opt?.id ?? null);
                                field.onChange(value);
                            }}
                        />
                    );
                }}
            />

            <p className="mt-1 h-4 text-xs text-red-600 font-montserrat" role="alert">
                {t(error) || ''}
            </p>

            {showInfo && (
                <Modal onClose={() => setShowInfo(false)}>
                    <div className="p-4 flex flex-col gap-4 items-center justify-center bg-white rounded-lg">
                        <FaInfoCircle className="text-blue-500 text-5xl" />
                        <h3 className="text-lg font-semibold text-gray-800">{t(info)}</h3>
                    </div>
                </Modal>
            )}
        </div>
    );
}
