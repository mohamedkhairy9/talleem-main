import React from 'react';
import * as yup from 'yup';
import { t } from 'i18next';
import InputRFH from '@/components/common/inputs/InputRFH';
import useRFH from '@/utils/hooks/global/useRFH';
import useLocale from '@/utils/hooks/global/useLocale';
import { allData } from '@/utils/constants/global.constants';
import { generateOptions } from '@/utils/helpers/global.fns';
import { useActivitiesQuery } from '@/api/hooks/useActivities';
import { useUpdateEntityLicenseActivitiesMutation } from '@/api/hooks/useEntities';

const schema = yup.object({
    activity_ids: yup
        .array()
        .of(yup.mixed())
        .min(1, t('validation.required'))
        .required(t('validation.required'))
});

const normalizeActivityIds = activities =>
    Array.isArray(activities)
        ? activities
              .map(activity => activity?.id ?? activity?.value ?? activity)
              .filter(value => value !== undefined && value !== null && value !== '')
        : [];

export default function UpdateEntityLicenseActivities({
    entityId,
    oldData
}) {
    const { currentLocale } = useLocale();
    const { mutate, isPending } = useUpdateEntityLicenseActivitiesMutation();
    const { data: activitiesResponse, isLoading: isActivitiesLoading } =
        useActivitiesQuery(allData);

    const defaultValues = {
        activity_ids: normalizeActivityIds(
            oldData?.activity_ids || oldData?.activities
        )
    };

    const { register, errors, handleSubmit, control } = useRFH({
        schema,
        defaultValues
    });

    const handleFormSubmit = values => {
        mutate({
            entityId,
            data: {
                activity_ids: values.activity_ids || []
            }
        });
    };

    return (
        <div className="space-y-6 p-5">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <h3 className="text-lg font-semibold text-gray-900">
                    {currentLocale === 'ar'
                        ? 'أنشطة الجهة'
                        : 'Entity Activities'}
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                    {currentLocale === 'ar'
                        ? 'اعرض جميع الأنشطة المتاحة وحدد الأنشطة المرتبطة بهذه الجهة ثم احفظ التعديل.'
                        : 'Review all available activities, choose the activities linked to this entity, then save your changes.'}
                </p>
            </div>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <InputRFH
                        control={control}
                        register={register}
                        error={errors.activity_ids}
                        type="select"
                        name="activity_ids"
                        label="validation.activity_ids.label"
                        placeholder="validation.activity_ids.placeholder"
                        options={generateOptions(activitiesResponse?.data || [])}
                        isMulti
                        required
                        loading={isActivitiesLoading}
                        isAsync={false}
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isPending}
                        className="inline-flex min-w-[180px] items-center justify-center rounded-lg bg-primary px-6 py-[10px] text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {isPending
                            ? currentLocale === 'ar'
                                ? 'جارٍ الحفظ...'
                                : 'Saving...'
                            : currentLocale === 'ar'
                            ? 'حفظ الأنشطة'
                            : 'Save Activities'}
                    </button>
                </div>
            </form>
        </div>
    );
}
