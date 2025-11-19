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
} from './configs';
import SendingMethodCard from './SendingMethodCard';
import NotificationContentForm from './NotificationContentForm';
import { getSendNotificationSchema } from '@/utils/yup/notificationSchema';
import { userTypeOptions } from '@/utils/constants/options';

export default function SendNotification({ onClose }) {
    const { t } = useLocale();
    const currentLang = i18next.language;
    const { mutate, isPending } = useTriggerNotificationMutation();
    const [selectedMethods, setSelectedMethods] = useState({
        sms: false,
        email: false,
        push: false,
        whatsapp: false
    });

    // Fetch all required data from APIs (without USER_TYPES)
    const {
        programsData,
        branchesData,
        entityTypesData,
        entitiesData,
        isLoading
    } = useApiCalls({ apiCalls: notificationApiCalls });

    // Transform user types with current language
    const transformedUserTypeOptions = useMemo(() => {
        return userTypeOptions.map(option => ({
            id: option.id,
            name: option.label[currentLang] || option.label.en,
            value: option.value
        }));
    }, [currentLang]);

    // Transform programs from API to options
    const programOptions = useMemo(() => {
        if (!programsData?.data) return [];
        return programsData.data.map(program => ({
            id: program.id,
            name: program.name?.[currentLang] || program.name?.ar || program.name?.en || program.name,
            value: program.id
        }));
    }, [programsData, currentLang]);

    // Transform branches from API to options
    const branchOptions = useMemo(() => {
        if (!branchesData?.data) return [];
        return branchesData.data.map(branch => ({
            id: branch.id,
            name: branch.name?.[currentLang] || branch.name?.ar || branch.name?.en || branch.name,
            value: branch.id
        }));
    }, [branchesData, currentLang]);

    // Transform entity types from API to options
    const entityTypeOptions = useMemo(() => {
        if (!entityTypesData?.data) return [];
        return entityTypesData.data.map(entityType => ({
            id: entityType.id,
            name: entityType.name?.[currentLang] || entityType.name?.ar || entityType.name?.en || entityType.name,
            value: entityType.id
        }));
    }, [entityTypesData, currentLang]);

    // Transform entities from API to options
    const entityOptions = useMemo(() => {
        if (!entitiesData?.data) return [];
        return entitiesData.data.map(entity => ({
            id: entity.id,
            name: entity.name?.[currentLang] || entity.name?.ar || entity.name?.en || entity.name,
            value: entity.id
        }));
    }, [entitiesData, currentLang]);

    const { register, errors, handleSubmit, control } = useRFH({
        schema: getSendNotificationSchema(selectedMethods, t),
        defaultValues: getDefaultFormValues()
    });

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
        console.log('Sending notification:', payload);

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

                {/* Content Forms for each selected method */}
                {sendingMethods.map(method => (
                    selectedMethods[method.key] && (
                        <NotificationContentForm
                            key={method.key}
                            method={method.key}
                            icon={method.icon}
                            title={t(`notifications.${method.key}_content`)}
                            control={control}
                            register={register}
                            errors={errors}
                            t={t}
                        />
                    )
                )
                )}

                {/* Target Users Filters */}
                <div className="border-t pt-6 space-y-4">
                    <h3 className="font-semibold text-lg text-gray-900">
                        {t('notifications.target_users')}
                    </h3>
                    
                    {/* User Type - Required - Multi-select */}
                    <InputRFH
                        control={control}
                        register={register}
                        error={errors.user_type?.message}
                        type="select"
                        label={t('notifications.user_type')}
                        name="user_type"
                        options={transformedUserTypeOptions}
                        isMulti={true}
                        placeholder={t('notifications.select_user_type')}
                    />

                    {/* Optional Filters - All from APIs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Program */}
                        <InputRFH
                            control={control}
                            register={register}
                            error={errors.program_id?.message}
                            type="select"
                            label={t('notifications.program')}
                            name="program_id"
                            options={programOptions}
                            placeholder={t('notifications.select_program')}
                        />

                        {/* Branch */}
                        <InputRFH
                            control={control}
                            register={register}
                            error={errors.branch_id?.message}
                            type="select"
                            label={t('notifications.branch')}
                            name="branch_id"
                            options={branchOptions}
                            placeholder={t('notifications.select_branch')}
                        />

                        {/* Entity Type */}
                        <InputRFH
                            control={control}
                            register={register}
                            error={errors.entity_type_id?.message}
                            type="select"
                            label={t('notifications.entity_type')}
                            name="entity_type_id"
                            options={entityTypeOptions}
                            placeholder={t('notifications.select_entity_type')}
                        />

                        {/* Entity */}
                        <InputRFH
                            control={control}
                            register={register}
                            error={errors.entity_id?.message}
                            type="select"
                            label={t('notifications.entity')}
                            name="entity_id"
                            options={entityOptions}
                            placeholder={t('notifications.select_entity')}
                        />
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