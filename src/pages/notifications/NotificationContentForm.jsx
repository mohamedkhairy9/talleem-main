import React from 'react';
import InputRFH from '@/components/common/inputs/InputRFH';

export default function NotificationContentForm({
    method,
    icon,
    title,
    control,
    register,
    errors,
    t
}) {
    return (
        <div className="p-4 bg-gray-50 rounded-lg space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <span>{icon}</span> {title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputRFH
                    control={control}
                    register={register}
                    error={errors[`${method}_title_ar`]?.message}
                    type="text"
                    label={t('notifications.title_ar')}
                    name={`${method}_title_ar`}
                    placeholder={t('notifications.enter_title_ar')}
                />
                <InputRFH
                    control={control}
                    register={register}
                    error={errors[`${method}_title_en`]?.message}
                    type="text"
                    label={t('notifications.title_en')}
                    name={`${method}_title_en`}
                    placeholder={t('notifications.enter_title_en')}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputRFH
                    control={control}
                    register={register}
                    error={errors[`${method}_content_ar`]?.message}
                    type="textarea"
                    label={t('notifications.content_ar')}
                    name={`${method}_content_ar`}
                    placeholder={t('notifications.enter_content_ar')}
                    rows={3}
                />
                <InputRFH
                    control={control}
                    register={register}
                    error={errors[`${method}_content_en`]?.message}
                    type="textarea"
                    label={t('notifications.content_en')}
                    name={`${method}_content_en`}
                    placeholder={t('notifications.enter_content_en')}
                    rows={3}
                />
            </div>
        </div>
    );
}