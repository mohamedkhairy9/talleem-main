import useRFH from '@/utils/hooks/global/useRFH';
import { studentsSchema as schema } from '@/utils/yup/students.schemas';
import React from 'react';
import { studentsFields } from './configs';
import InputRFH from '@/components/common/inputs/InputRFH';
import FileInputRFH from '@/components/common/inputs/FileInputRFH';
import Btn from '@/components/common/buttons/Btn';
import { getNestedError } from '@/utils/helpers/getNestedError';
import { generateOptions } from '@/utils/helpers/global.fns';
import { onlyDate } from '@/utils/helpers/global.fns';
import useLocale from '@/utils/hooks/global/useLocale';

export default function FormStudent({
    onClose,
    oldData,
    editMode,
    viewMode,
    isPending,
    mutate,
    options
}) {
    const { t } = useLocale();
    const { register, errors, handleSubmit, control, watch } = useRFH({
        schema,
        defaultValues: {
            ...oldData,
            date_of_birth: onlyDate(oldData?.date_of_birth),
            registration_date: onlyDate(oldData?.registration_date),
            qualification: oldData?.qualification || {
                has_high_school: 0,
                high_school_grade: 0,
                has_bachelors_degree: 0,
                specification: null,
                has_memorized_quran_5_parts: 0,
                memorized_quran_parts: 0
            },
            department: oldData?.department || { en: '', ar: '' }
        }
    });

    const hasMedicalIssues = watch('has_medical_issues');

    function onSubmit(data) {
        console.log('data', data);
        mutate(
            { ...data, status: data.status ? 1 : 0 },
            {
                onSuccess: () => {
                    onClose();
                }
            }
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {studentsFields
                    .filter(
                        field =>
                            (editMode && field.editMode) ||
                            (viewMode && field.viewMode) ||
                            (!editMode && !viewMode)
                    )
                    .map(field => {
                        // Conditionally show issue_description only if has_medical_issues is 1
                        if (
                            field.name === 'issue_description' &&
                            hasMedicalIssues !== 1
                        ) {
                            return null;
                        }

                        return (
                            <div
                                key={field.name}
                                className={
                                    field.type === 'textarea'
                                        ? 'md:col-span-2 lg:col-span-3'
                                        : field.type === 'file'
                                        ? 'md:col-span-2 lg:col-span-3'
                                        : ''
                                }
                            >
                                {field.type === 'file' ? (
                                    <FileInputRFH
                                        register={register}
                                        control={control}
                                        error={getNestedError(
                                            errors,
                                            field.name
                                        )}
                                        placeholder={field.placeholder}
                                        disabled={viewMode}
                                        label={field.label}
                                        name={field.name}
                                        multiple={field.multiple}
                                        defaultValue={oldData?.files || []}
                                    />
                                ) : (
                                    <InputRFH
                                        p="px-3 py-3"
                                        control={control}
                                        register={register}
                                        error={getNestedError(
                                            errors,
                                            field.name
                                        )}
                                        type={field.type}
                                        placeholder={field.placeholder}
                                        disabled={viewMode}
                                        label={field.label}
                                        name={field.name}
                                        options={generateOptions(
                                            options?.[field.name]
                                        )}
                                        defaultValue={
                                            oldData?.[field.name] ||
                                            field.defaultValue
                                        }
                                    />
                                )}
                            </div>
                        );
                    })}
            </div>

            {/* Qualification Section */}
            <div className="mt-6 space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">
                    {t('students.qualification')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border border-gray-200 rounded-lg ">
                    <InputRFH
                        p="px-3 py-3"
                        control={control}
                        register={register}
                        error={getNestedError(
                            errors,
                            'qualification.has_high_school'
                        )}
                        type="select"
                        placeholder="validation.qualification.has_high_school.placeholder"
                        disabled={viewMode}
                        label="validation.qualification.has_high_school.label"
                        name="qualification.has_high_school"
                        options={generateOptions(options?.has_high_school)}
                        defaultValue={
                            oldData?.qualification?.has_high_school ?? 0
                        }
                    />
                    <InputRFH
                        p="px-3 py-3"
                        control={control}
                        register={register}
                        error={getNestedError(
                            errors,
                            'qualification.high_school_grade'
                        )}
                        type="number"
                        placeholder="validation.qualification.high_school_grade.placeholder"
                        disabled={viewMode}
                        label="validation.qualification.high_school_grade.label"
                        name="qualification.high_school_grade"
                        defaultValue={
                            oldData?.qualification?.high_school_grade ?? 0
                        }
                    />
                    <InputRFH
                        p="px-3 py-3"
                        control={control}
                        register={register}
                        error={getNestedError(
                            errors,
                            'qualification.has_bachelors_degree'
                        )}
                        type="select"
                        placeholder="validation.qualification.has_bachelors_degree.placeholder"
                        disabled={viewMode}
                        label="validation.qualification.has_bachelors_degree.label"
                        name="qualification.has_bachelors_degree"
                        options={generateOptions(options?.has_bachelors_degree)}
                        defaultValue={
                            oldData?.qualification?.has_bachelors_degree ?? 0
                        }
                    />
                    <InputRFH
                        p="px-3 py-3"
                        control={control}
                        register={register}
                        error={getNestedError(
                            errors,
                            'qualification.specification'
                        )}
                        type="select"
                        placeholder="validation.qualification.specification.placeholder"
                        disabled={viewMode}
                        label="validation.qualification.specification.label"
                        name="qualification.specification"
                        options={generateOptions(options?.specification_id)}
                        defaultValue={
                            oldData?.qualification?.specification || ''
                        }
                    />
                    <InputRFH
                        p="px-3 py-3"
                        control={control}
                        register={register}
                        error={getNestedError(
                            errors,
                            'qualification.has_memorized_quran_5_parts'
                        )}
                        type="select"
                        placeholder="validation.qualification.has_memorized_quran_5_parts.placeholder"
                        disabled={viewMode}
                        label="validation.qualification.has_memorized_quran_5_parts.label"
                        name="qualification.has_memorized_quran_5_parts"
                        options={generateOptions(
                            options?.has_memorized_quran_5_parts
                        )}
                        defaultValue={
                            oldData?.qualification
                                ?.has_memorized_quran_5_parts ?? 0
                        }
                    />
                    <InputRFH
                        p="px-3 py-3"
                        control={control}
                        register={register}
                        error={getNestedError(
                            errors,
                            'qualification.memorized_quran_parts'
                        )}
                        type="number"
                        placeholder="validation.qualification.memorized_quran_parts.placeholder"
                        disabled={viewMode}
                        label="validation.qualification.memorized_quran_parts.label"
                        name="qualification.memorized_quran_parts"
                        defaultValue={
                            oldData?.qualification?.memorized_quran_parts ?? 0
                        }
                    />
                </div>
            </div>

            {!viewMode && (
                <Btn
                    loading={isPending}
                    className="py-[10px] w-full"
                    type="submit"
                    label="common.submit"
                />
            )}
        </form>
    );
}
