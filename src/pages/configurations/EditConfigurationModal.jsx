import React, { useMemo } from 'react';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import useRFH from '@/utils/hooks/global/useRFH';
import InputRFH from '@/components/common/inputs/InputRFH';
import Btn from '@/components/common/buttons/Btn';
import { useUpdateConfigurationMutation } from '@/api/hooks/useConfigurations';
import useLocale from '@/utils/hooks/global/useLocale';
import i18next from 'i18next';
import Loader from '@/components/common/Loader';
import useCustomQuery from '@/utils/hooks/global/useCustomQuery';
import { API_KEYS } from '@/api/endpoints';
import * as yup from 'yup';
import { remotelyAttendancePlatformsServices } from '@/api/services/remotelyAttendancePlatforms';
import { teachingMethodOptions, weekDaysOptions } from './configs';

export default function EditConfigurationModal({ config, onClose }) {
    const { t } = useLocale();
    const currentLang = i18next.language;
    const { mutate, isPending } = useUpdateConfigurationMutation();

    // Fetch platforms directly
    const { data: platformsData, isLoading: platformsLoading } = useCustomQuery({
        queryKey: [API_KEYS.REMOTELY_ATTENDANCE_PLATFORMS, { status: true }],
        queryFn: () => remotelyAttendancePlatformsServices.getRemotelyAttendancePlatforms({ status: true }),
        enabled: config.key === 'platform'
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

    // Prepare default value - convert platform names to IDs
    const getDefaultValue = () => {
        if (config.type === 'checkbox') {
            return config.value === '1' || config.value === true;
        }

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

            console.log('Platform names from config:', platformNames);
            console.log('Matched platform IDs:', platformIds);

            return platformIds;
        }

        return config.value;
    };

    const { register, errors, handleSubmit, control, watch } = useRFH({
        schema,
        defaultValues: {
            value: getDefaultValue()
        }
    });

    // Watch the value to see what's selected
    const currentValue = watch('value');
    console.log('Current form value:', currentValue);

    function onSubmit(data) {
        console.log('Form submitted with data:', data);

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
            console.log('Converted IDs to names:', valueToSend);
        }

        const payload = {
            [config.key]: config.type === 'checkbox'
                ? (data.value ? '1' : '0')
                : valueToSend.toString()
        };

        console.log('Submitting payload:', payload);

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

        // Check if it's teaching method
        if (config.key === 'teaching_method') {
            return {
                type: 'select',
                options: teachingMethodOptions,
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
            case 'select':
                // Parse comma-separated values as options
                // eslint-disable-next-line no-case-declarations
                const options = config.value.split(',').map(opt => ({
                    value: opt.trim(),
                    label: opt.trim(),
                    id: opt.trim(),
                    name: opt.trim()
                }));
                return { type: 'select', options, isMulti: false };
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
                    label={t('configurations.value')}
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