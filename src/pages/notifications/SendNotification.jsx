import React, { useMemo } from 'react';
import i18next from 'i18next';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import InputRFH from '@/components/common/inputs/InputRFH';
import Btn from '@/components/common/buttons/Btn';
import useRFH from '@/utils/hooks/global/useRFH';
import useLocale from '@/utils/hooks/global/useLocale';
import { useTriggerNotificationMutation } from '@/api/hooks/useNotifications';
import { getSendNotificationSchema } from '@/utils/yup/notificationSchema';
import { createAsyncLoadOptions } from '@/utils/helpers/asyncSelectHelpers';
import { usersService } from '@/api/services/users.service';

const defaultValues = {
    user_id: null,
    sending_type: 'in-app-inbox',
    title_ar: '',
    title_en: '',
    description_ar: '',
    description_en: ''
};

export default function SendNotification({ onClose }) {
    const { t } = useLocale();
    const currentLang = i18next.language;
    const { mutate, isPending } = useTriggerNotificationMutation();
    const { register, errors, handleSubmit, control } = useRFH({
        schema: getSendNotificationSchema(t),
        defaultValues
    });

    const sendingTypeOptions = useMemo(
        () => [
            {
                value: 'in-app-inbox',
                label: t('table_headers.inbox')
            }
        ],
        [t]
    );

    const loadUserOptions = useMemo(
        () =>
            createAsyncLoadOptions(usersService.getUsers, {}, user => {
                const userName =
                    user.name?.[currentLang] ||
                    user.name?.en ||
                    user.name?.ar ||
                    user.name ||
                    user.full_name ||
                    user.username ||
                    `#${user.id}`;

                return {
                    value: user.id,
                    id: user.id,
                    label: userName
                };
            }),
        [currentLang]
    );

    function onSubmit(data) {
        mutate(
            {
                title: {
                    en: data.title_en,
                    ar: data.title_ar
                },
                content: {
                    en: data.description_en,
                    ar: data.description_ar
                },
                filters: {
                    user_id: Number(data.user_id)
                },
                // Inbox is the only enabled delivery method for direct sends.
                sending_type: 'in-app-inbox'
            },
            {
                onSuccess: () => {
                    onClose();
                }
            }
        );
    }

    return (
        <Modal onClose={onClose} size="3xl">
            <ModalHeader onClose={onClose} header={t('notifications.send')} />
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="p-6 space-y-6 max-h-[80vh] overflow-y-auto"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputRFH
                        control={control}
                        register={register}
                        error={errors.user_id?.message}
                        type="select"
                        label="table_headers.user"
                        name="user_id"
                        placeholder="table_headers.user"
                        isAsync={true}
                        loadOptions={loadUserOptions}
                        defaultOptions={true}
                        required={true}
                    />
                    <InputRFH
                        control={control}
                        register={register}
                        error={errors.sending_type?.message}
                        type="select"
                        label="notifications.sending_method"
                        name="sending_type"
                        placeholder="notifications.sending_method"
                        options={sendingTypeOptions}
                        disabled={true}
                        required={true}
                    />
                </div>

                <div className="p-4 bg-gray-50 rounded-lg space-y-4 border-t pt-6">
                    <h3 className="font-semibold text-lg text-gray-900">
                        {t('notifications.notification_content')}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputRFH
                            control={control}
                            register={register}
                            error={errors.title_ar?.message}
                            type="text"
                            label="notifications.title_ar"
                            name="title_ar"
                            placeholder="notifications.enter_title_ar"
                            p="px-3 py-3"
                        />
                        <InputRFH
                            control={control}
                            register={register}
                            error={errors.title_en?.message}
                            type="text"
                            label="notifications.title_en"
                            name="title_en"
                            placeholder="notifications.enter_title_en"
                            p="px-3 py-3"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputRFH
                            control={control}
                            register={register}
                            error={errors.description_ar?.message}
                            type="textarea"
                            label="notifications.description_ar"
                            name="description_ar"
                            placeholder="notifications.enter_description_ar"
                            p="px-3 py-3"
                        />
                        <InputRFH
                            control={control}
                            register={register}
                            error={errors.description_en?.message}
                            type="textarea"
                            label="notifications.description_en"
                            name="description_en"
                            placeholder="notifications.enter_description_en"
                            p="px-3 py-3"
                        />
                    </div>
                </div>

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
                    />
                </div>
            </form>
        </Modal>
    );
}
