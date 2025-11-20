import React, { useState, useMemo } from 'react';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import useRFH from '@/utils/hooks/global/useRFH';
import InputRFH from '@/components/common/inputs/InputRFH';
import Btn from '@/components/common/buttons/Btn';
import { useTriggerNotificationMutation } from '@/api/hooks/useNotifications';
import useLocale from '@/utils/hooks/global/useLocale';
import i18next from 'i18next';
import useApiCalls from './useApiCalls';
import {
    notificationApiCalls,
    sendingMethods,
    prepareNotificationPayload,
    getDefaultFormValues,
    userTypeOptions,
    notificationFields
} from './configs';
import SendingMethodCard from './SendingMethodCard';
import { generateOptions } from '@/utils/helpers/global.fns';
import { getNestedError } from '@/utils/helpers/getNestedError';
import { getSendNotificationSchema } from '@/utils/yup/notificationSchema';

export default function SendNotification({ onClose }) {
    const { t } = useLocale();
    const currentLang = i18next.language;
    const { mutate, isPending } = useTriggerNotificationMutation();
    
    // Default: push is selected
    const [selectedMethods, setSelectedMethods] = useState({
        sms: false,
        email: false,
        push: true,
        whatsapp: false
    });

    // Fetch all required data from APIs
    const apiData = useApiCalls({ apiCalls: notificationApiCalls });
    const { isLoading, branches, entities, roles } = apiData;

    // Transform user types with current language
    const transformedUserTypes = useMemo(() => {
        return userTypeOptions.map(option => ({
            id: option.id,
            name: option.label[currentLang] || option.label.en,
            value: option.value
        }));
    }, [currentLang]);

    // Filter roles to exclude super-admin
    const filteredRoles = useMemo(() => {
        if (!roles?.data) return [];
        return roles.data.filter(role => {
            // Check if name is string or object
            const roleName = typeof role.name === 'string' 
                ? role.name 
                : role.name?.en || role.name?.ar || '';
            
            return roleName.toLowerCase() !== 'super-admin' && roleName !== 'super_admin';
        });
    }, [roles]);

    const { register, errors, handleSubmit, control, watch } = useRFH({
        schema: getSendNotificationSchema(selectedMethods, t),
        defaultValues: getDefaultFormValues()
    });

    // Watch branch_id to filter entities
    const watchedBranchId = watch('branch_id');

    // Filter entities based on selected branch
    const filteredEntities = useMemo(() => {
        if (!entities?.data) return [];
        
        // If no branch selected, show all entities
        if (!watchedBranchId) {
            return entities.data;
        }
        
        // Filter entities by branch_id
        const filtered = entities.data.filter(entity => {
            // Make sure to compare as numbers or strings consistently
            const entityBranchId = entity.branch.id;
            const selectedBranchId = watchedBranchId;
            
            // Try both strict and loose comparison
            return entityBranchId === selectedBranchId || 
                   Number(entityBranchId) === Number(selectedBranchId);
        });
        
        return filtered;
    }, [entities, watchedBranchId]);

    const isAnyMethodSelected = Object.values(selectedMethods).some(Boolean);

    const handleMethodToggle = (method) => {
        setSelectedMethods(prev => ({
            ...prev,
            [method]: !prev[method]
        }));
    };

    function onSubmit(data) {
        if (!isAnyMethodSelected) {
            return;
        }

        const payload = prepareNotificationPayload(data, selectedMethods);

        mutate(payload, {
            onSuccess: () => {
                onClose();
            }
        });
    }

    if (isLoading) {
        return (
            <Modal onClose={onClose} size="4xl">
                <ModalHeader onClose={onClose} header={t('notifications.send')} />
                <div className="p-8 flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            </Modal>
        );
    }

    // Prepare options object
    const options = {
        user_type: transformedUserTypes,
        role_id: filteredRoles,
        branch_id: branches?.data,
        entity_id: filteredEntities
    };

    return (
        <Modal onClose={onClose} size="5xl">
            <ModalHeader onClose={onClose} header={t('notifications.send')} />
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
                {/* Sending Methods */}
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                        {t('notifications.how_to_send')} *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {sendingMethods.map(method => (
                            <SendingMethodCard
                                key={method.key}
                                method={method}
                                selected={selectedMethods[method.key]}
                                onToggle={() => handleMethodToggle(method.key)}
                                t={t}
                            />
                        ))}
                    </div>
                    {!isAnyMethodSelected && (
                        <p className="text-sm text-red-500">
                            {t('notifications.select_at_least_one_method')}
                        </p>
                    )}
                </div>

                {/* Single Content Form */}
                <div className="p-4 bg-gray-50 rounded-lg space-y-4 border-t pt-6">
                    <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
                        <span>✉️</span> {t('notifications.notification_content')}
                    </h3>
                    
                    {/* Title & Description Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputRFH
                            control={control}
                            register={register}
                            error={errors.title_ar?.message}
                            type="text"
                            label={t('notifications.title_ar')}
                            name="title_ar"
                            placeholder={t('notifications.enter_title_ar')}
                            p="px-3 py-3"
                        />
                        <InputRFH
                            control={control}
                            register={register}
                            error={errors.title_en?.message}
                            type="text"
                            label={t('notifications.title_en')}
                            name="title_en"
                            placeholder={t('notifications.enter_title_en')}
                            p="px-3 py-3"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputRFH
                            control={control}
                            register={register}
                            error={errors.description_ar?.message}
                            type="textarea"
                            label={t('notifications.description_ar')}
                            name="description_ar"
                            placeholder={t('notifications.enter_description_ar')}
                            p="px-3 py-3"
                        />
                        <InputRFH
                            control={control}
                            register={register}
                            error={errors.description_en?.message}
                            type="textarea"
                            label={t('notifications.description_en')}
                            name="description_en"
                            placeholder={t('notifications.enter_description_en')}
                            p="px-3 py-3"
                        />
                    </div>
                </div>

                {/* Target Users Filters */}
                <div className="border-t pt-6 space-y-4">
                    <h3 className="font-semibold text-lg text-gray-900">
                        {t('notifications.target_users')}
                    </h3>
                    
                    {/* Dynamic Fields */}
                    <div className="space-y-4">
                        {notificationFields.map(field => (
                            <div 
                                key={field.name}
                                className={field.gridColumn === 'full' ? 'w-full' : ''}
                            >
                                {field.gridColumn === 'full' ? (
                                    <InputRFH
                                        control={control}
                                        register={register}
                                        error={getNestedError(errors, field.name)}
                                        type={field.type}
                                        label={field.label}
                                        name={field.name}
                                        options={generateOptions(options?.[field.name])}
                                        isMulti={field.isMulti}
                                        placeholder={field.placeholder}
                                        p="px-3 py-3"
                                    />
                                ) : null}
                            </div>
                        ))}

                        {/* Half width fields in grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {notificationFields
                                .filter(field => field.gridColumn === 'half')
                                .map(field => (
                                    <InputRFH
                                        key={field.name}
                                        control={control}
                                        register={register}
                                        error={getNestedError(errors, field.name)}
                                        type={field.type}
                                        label={field.label}
                                        name={field.name}
                                        options={generateOptions(options?.[field.name])}
                                        isMulti={field.isMulti}
                                        placeholder={field.placeholder}
                                        p="px-3 py-3"
                                    />
                                ))}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                    <Btn
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800"
                        label="common.cancel"
                    />
                    <Btn
                        loading={isPending}
                        className="flex-1 py-3"
                        type="submit"
                        label="notifications.send"
                        disabled={!isAnyMethodSelected}
                    />
                </div>
            </form>
        </Modal>
    );
}