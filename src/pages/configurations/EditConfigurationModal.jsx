import React, { useMemo, useEffect } from 'react';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import useRFH from '@/utils/hooks/global/useRFH';
import InputRFH from '@/components/common/inputs/InputRFH';
import Btn from '@/components/common/buttons/Btn';
import { useUpdateConfigurationMutation } from '@/api/hooks/useConfigurations';
import useLocale from '@/utils/hooks/global/useLocale';
import i18next from 'i18next';
import Loader from '@/components/common/Loader';
import * as yup from 'yup';
import { weekDaysOptions } from './configs';
import { API_KEYS } from '@/api/endpoints';
import useApiCalls from './useApiCalls';

export default function EditConfigurationModal({ config, onClose }) {
    const { t } = useLocale();
    const currentLang = i18next.language;
    const { mutate, isPending } = useUpdateConfigurationMutation();

    // Use the useApiCalls hook - fetch platforms for 'platform' and session modes for 'teaching_method'
    const apiCallsToFetch = [];
    if (config.key === 'platform') {
        apiCallsToFetch.push({ key: API_KEYS.REMOTELY_ATTENDANCE_PLATFORMS });
    }
    if (config.key === 'teaching_method') {
        apiCallsToFetch.push({ key: API_KEYS.SESSION_MODES });
    }
    
    const { platformsData, sessionModesData, isLoading: platformsLoading } = useApiCalls({
        apiCalls: apiCallsToFetch
    });

    // Platform options from API - use ID as value for proper tracking
    const platformOptions = useMemo(() => {
        if (!platformsData?.data) {
            return [];
        }

        const options = platformsData.data.map(platform => {
            const name = platform.name?.[currentLang] || platform.name?.ar || platform.name?.en || platform.name;
            return {
                value: platform.id, // Use ID as value for proper tracking
                label: name,
                id: platform.id,
                name: name,
                platformName: name // Store the display name
            };
        });

        return options;
    }, [platformsData, currentLang]);

    // Session mode options from API - use ID as value for proper tracking
    const sessionModeOptions = useMemo(() => {
        if (!sessionModesData?.data) {
            return [];
        }

        const options = sessionModesData.data.map(sessionMode => {
            const name = sessionMode.name?.[currentLang] || sessionMode.name?.ar || sessionMode.name?.en || sessionMode.name;
            return {
                value: sessionMode.id, // Use ID as value for proper tracking
                label: name,
                id: sessionMode.id,
                name: name,
                sessionModeName: name // Store the display name
            };
        });

        return options;
    }, [sessionModesData, currentLang]);

    // Determine if field is multi-select for platform
    const isMultiSelect = config.key === 'platform';

    // Create validation schema based on field type
    const schema = yup.object().shape({
        value: config.type === 'number'
            ? yup.number().required(t('validation.required'))
            : config.type === 'checkbox'
                ? yup.boolean()
                : isMultiSelect
                    ? yup.array().min(1, t('validation.required')).required(t('validation.required'))
                    : yup.string().required(t('validation.required'))
    });

    // Prepare default value - convert platform names to IDs or use IDs directly
    const getDefaultValue = () => {
        if (config.type === 'checkbox') {
            return config.value === '1' || config.value === true;
        }

        // Handle platform field (multi-select) - convert names to IDs
        if (isMultiSelect && config.value && platformOptions.length > 0) {
            // Split comma-separated platform names
            const platformNames = config.value.split(',').map(p => p.trim());

            // Find matching platform IDs
            const platformIds = platformNames
                .map(name => {
                    const platform = platformOptions.find(opt => opt.platformName === name);
                    return platform ? platform.value : null;
                })
                .filter(Boolean);

            return platformIds;
        }

        // Handle teaching_method field - value might be an ID or a name
        if (config.key === 'teaching_method' && config.value) {
            // Check if value is already an ID (number or numeric string)
            const numericValue = Number(config.value);
            if (!isNaN(numericValue) && sessionModeOptions.length > 0) {
                // Check if this ID exists in sessionModeOptions
                const sessionMode = sessionModeOptions.find(opt => opt.value === numericValue || opt.value === config.value);
                if (sessionMode) {
                    return sessionMode.value; // Use the ID directly
                }
            }
            
            // If not found as ID, try to find by name (for backward compatibility)
            if (sessionModeOptions.length > 0) {
                const sessionMode = sessionModeOptions.find(opt => 
                    opt.sessionModeName === config.value || 
                    opt.name === config.value ||
                    opt.label === config.value
                );
                if (sessionMode) {
                    return sessionMode.value; // Return the ID
                }
            }
            
            // If sessionModeOptions not loaded yet, return the value as-is (will be handled when options load)
            return config.value;
        }

        return config.value;
    };

    const { register, errors, handleSubmit, control, watch, setValue } = useRFH({
        schema,
        defaultValues: {
            value: getDefaultValue()
        }
    });

    // Watch the value to see what's selected
    const currentValue = watch('value');

    // Update form value when sessionModeOptions loads (for teaching_method field)
    useEffect(() => {
        if (config.key === 'teaching_method' && config.value && sessionModeOptions.length > 0) {
            const numericValue = Number(config.value);
            if (!isNaN(numericValue)) {
                // Check if this ID exists in sessionModeOptions
                const sessionMode = sessionModeOptions.find(opt => opt.value === numericValue || opt.value === config.value);
                if (sessionMode) {
                    setValue('value', sessionMode.value, { shouldValidate: false });
                }
            } else {
                // Try to find by name (for backward compatibility)
                const sessionMode = sessionModeOptions.find(opt => 
                    opt.sessionModeName === config.value || 
                    opt.name === config.value ||
                    opt.label === config.value
                );
                if (sessionMode) {
                    setValue('value', sessionMode.value, { shouldValidate: false });
                }
            }
        }
    }, [sessionModeOptions, config.key, config.value, setValue]);

    function onSubmit(data) {
        let valueToSend = data.value;

        // Handle multi-select platforms - convert IDs back to names
        if (isMultiSelect && Array.isArray(data.value)) {
            const platformNames = data.value
                .map(id => {
                    const platform = platformOptions.find(opt => opt.value === id);
                    return platform ? platform.platformName : null;
                })
                .filter(Boolean);

            valueToSend = platformNames.join(', ');
        }
        
        // Handle teaching_method - send the ID directly (not convert to name)
        if (config.key === 'teaching_method') {
            // data.value is already the session mode ID, send it as-is
            valueToSend = data.value;
        }

        const payload = {
            [config.key]: config.type === 'checkbox'
                ? (data.value ? '1' : '0')
                : valueToSend.toString()
        };

        mutate(
            { program: config.program, data: payload },
            {
                onSuccess: () => {
                    onClose();
                }
            }
        );
    }

    // Determine field type and options
    const getFieldConfig = () => {
        // Check if it's a weekly holiday field
        if (config.key === 'weekly_holiday') {
            return {
                type: 'select',
                options: weekDaysOptions,
                isMulti: false
            };
        }

        // Check if it's teaching method - use sessionModesData from API
        if (config.key === 'teaching_method') {
            return {
                type: 'select',
                options: sessionModeOptions,
                isMulti: false
            };
        }

        // Check if it's platform
        if (config.key === 'platform') {
            return {
                type: 'select',
                options: platformOptions,
                isMulti: true // Allow multiple platform selection
            };
        }

        // Default based on config type
        switch (config.type) {
            case 'checkbox':
                return { type: 'checkbox', options: [], isMulti: false };
            case 'number':
                return { type: 'number', options: [], isMulti: false };
            case 'select': {
                // Options for select fields come from the response config.options (e.g. JSON string array)
                let options = [];
                const responseOptions = config.options;
                if (responseOptions != null && responseOptions !== '') {
                    try {
                        const raw = typeof responseOptions === 'string' ? JSON.parse(responseOptions) : responseOptions;
                        const arr = Array.isArray(raw) ? raw : [raw];
                        options = arr.map(opt => {
                            const val = typeof opt === 'string' ? opt : (opt?.value ?? opt?.label ?? String(opt));
                            return {
                                value: val,
                                label: val,
                                id: val,
                                name: val
                            };
                        });
                    } catch {
                        options = [];
                    }
                }
                if (options.length === 0 && config.value) {
                    options = config.value.split(',').map(opt => {
                        const v = opt.trim();
                        return { value: v, label: v, id: v, name: v };
                    }).filter(opt => opt.value);
                }
                return { type: 'select', options, isMulti: false };
            }
            default:
                return { type: 'text', options: [], isMulti: false };
        }
    };

    const fieldConfig = getFieldConfig();

    if (platformsLoading) {
        return (
            <Modal onClose={onClose}>
                <ModalHeader onClose={onClose} header={t('configurations.edit')} />
                <div className="p-8 flex justify-center">
                    <Loader />
                </div>
            </Modal>
        );
    }

    return (
        <Modal onClose={onClose}>
            <ModalHeader
                onClose={onClose}
                header={t('configurations.edit')}
            />
            <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
                <div className="mb-4 p-3 bg-gray-50 rounded">
                    <p className="text-sm text-gray-600 font-medium">{config.label}</p>
                </div>

                <InputRFH
                    p="px-3 py-3"
                    control={control}
                    register={register}
                    error={errors.value?.message}
                    type={fieldConfig.type}
                    label={fieldConfig.type === "checkbox" ? t('validation.is_active.label') : t('configurations.value')}
                    name="value"
                    options={fieldConfig.options}
                    isMulti={fieldConfig.isMulti}
                    placeholder={
                        config.key === 'weekly_holiday'
                            ? t('configurations.select_day')
                            : config.key === 'teaching_method'
                                ? t('configurations.select_method')
                                : config.key === 'platform'
                                    ? t('configurations.select_platforms')
                                    : t('configurations.enter_value')
                    }
                />

                {/* Show selected platforms */}
                {config.key === 'platform' && Array.isArray(currentValue) && currentValue.length > 0 && (
                    <div className="p-3 bg-blue-50 rounded">
                        <p className="text-xs font-medium text-gray-700 mb-2">
                            {t('configurations.selected_platforms')}:
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {currentValue.map(id => {
                                const platform = platformOptions.find(opt => opt.value === id);
                                return platform ? (
                                    <span
                                        key={id}
                                        className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium"
                                    >
                                        {platform.platformName}
                                    </span>
                                ) : null;
                            })}
                        </div>
                    </div>
                )}

                <Btn
                    loading={isPending}
                    className="py-3 w-full"
                    type="submit"
                    label="common.save"
                />
            </form>
        </Modal>
    );
}