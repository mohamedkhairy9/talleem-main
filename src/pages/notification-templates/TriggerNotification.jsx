import React from 'react';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useTriggerNotificationMutation } from '@/api/hooks/useNotifications';
import { useUsersQuery } from '@/api/hooks/useUsers';
import { allData } from '@/utils/constants/global.constants';
import Loader from '@/components/common/Loader';
import useRFH from '@/utils/hooks/global/useRFH';
import * as yup from 'yup';
import { t } from 'i18next';
import InputRFH from '@/components/common/inputs/InputRFH';
import { generateOptions } from '@/utils/helpers/global.fns';
import Btn from '@/components/common/buttons/Btn';
import { getNestedError } from '@/utils/helpers/getNestedError';

const triggerSchema = yup.object({
    template_id: yup.number().required(t('validation.required')),
    user_ids: yup
        .array()
        .of(yup.number())
        .min(1, t('validation.required'))
        .required(t('validation.required'))
});

export default function TriggerNotification({ onClose, template }) {
    const { mutate, isPending } = useTriggerNotificationMutation();
    const { data: usersData, isLoading: usersLoading } = useUsersQuery(allData);

    const { register, errors, handleSubmit, control } = useRFH({
        schema: triggerSchema,
        defaultValues: {
            template_id: template?.id,
            user_ids: []
        }
    });

    function onSubmit(data) {
        console.log('Trigger data:', data);
        mutate(data, {
            onSuccess: () => {
                onClose();
            }
        });
    }

    if (usersLoading) return <Loader />;

    return (
        <Modal onClose={onClose} size="lg">
            <ModalHeader onClose={onClose} header="notifications.trigger" />
            <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">
                        {t('notifications.template')}
                    </h3>
                    <p className="text-blue-800">
                        {template?.subject?.en || template?.subject?.ar}
                    </p>
                </div>

                <InputRFH
                    control={control}
                    register={register}
                    error={getNestedError(errors, 'user_ids')}
                    type="select"
                    label="validation.users.label"
                    placeholder="validation.users.placeholder"
                    name="user_ids"
                    options={generateOptions(usersData?.data)}
                    isMulti={true}
                />

                <Btn
                    loading={isPending}
                    className="py-[10px] w-full"
                    type="submit"
                    label="notifications.send_now"
                />
            </form>
        </Modal>
    );
}
