import React from 'react';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useScheduleNotificationMutation } from '@/api/hooks/useNotifications';
import useRFH from '@/utils/hooks/global/useRFH';
import * as yup from 'yup';
import { t } from 'i18next';
import InputRFH from '@/components/common/inputs/InputRFH';
import { generateOptions } from '@/utils/helpers/global.fns';
import Btn from '@/components/common/buttons/Btn';
import { getNestedError } from '@/utils/helpers/getNestedError';
import { timeUnitOptions } from '@/utils/constants/options';

const scheduleSchema = yup.object({
    template_id: yup.number().required(t('validation.required')),
    time: yup
        .number()
        .required(t('validation.required'))
        .min(1, t('validation.time.min'))
        .integer(t('validation.time.integer')),
    time_unit: yup
        .string()
        .required(t('validation.required'))
        .oneOf(
            ['minute', 'hour', 'day', 'month'],
            t('validation.time_unit.invalid')
        )
});

export default function ScheduleNotification({ onClose, template }) {
    const { mutate, isPending } = useScheduleNotificationMutation();

    const { register, errors, handleSubmit, control, watch } = useRFH({
        schema: scheduleSchema,
        defaultValues: {
            template_id: template?.id,
            time: 1,
            time_unit: 'minute'
        }
    });

    const timeValue = watch('time');
    const timeUnit = watch('time_unit');

    function onSubmit(data) {
        console.log('Schedule data:', data);
        mutate(data, {
            onSuccess: () => {
                onClose();
            }
        });
    }

    return (
        <Modal onClose={onClose} size="lg">
            <ModalHeader onClose={onClose} header="notifications.schedule" />
            <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">
                        {t('notifications.template')}
                    </h3>
                    <p className="text-blue-800">
                        {template?.subject?.en || template?.subject?.ar}
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <InputRFH
                        control={control}
                        register={register}
                        error={getNestedError(errors, 'time')}
                        type="number"
                        label="validation.time.label"
                        placeholder="validation.time.placeholder"
                        name="time"
                    />

                    <InputRFH
                        control={control}
                        register={register}
                        error={getNestedError(errors, 'time_unit')}
                        type="select"
                        label="validation.time_unit.label"
                        placeholder="validation.time_unit.placeholder"
                        name="time_unit"
                        options={generateOptions(timeUnitOptions)}
                    />
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-900 text-sm">
                        {t('notifications.will_be_sent_in')} {timeValue}{' '}
                        {timeUnit}(s)
                    </p>
                </div>

                <Btn
                    loading={isPending}
                    className="py-[10px] w-full"
                    type="submit"
                    label="notifications.schedule_notification"
                />
            </form>
        </Modal>
    );
}
