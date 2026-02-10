import InputRFH from '@/components/common/inputs/InputRFH';
import { getNestedError } from '@/utils/helpers/getNestedError';
import { generateOptions } from '@/utils/helpers/global.fns';
import useLocale from '@/utils/hooks/global/useLocale';

export default function QualificationSection({
    control,
    register,
    errors,
    viewMode,
    options,
    hasHighSchool,
    hasBachelors,
    hasMemorizedFive
}) {
    const { t } = useLocale();

    return (
        <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
                {t('students.qualification')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border border-gray-200 rounded-lg">
                <InputRFH
                    p="px-3 py-3"
                    control={control}
                    register={register}
                    error={getNestedError(errors, 'qualification.has_high_school')}
                    type="select"
                    placeholder="validation.qualification.has_high_school.placeholder"
                    disabled={viewMode}
                    label="validation.qualification.has_high_school.label"
                    name="qualification.has_high_school"
                    options={generateOptions(options?.has_high_school)}
                />
                {Number(hasHighSchool) === 1 && (
                    <InputRFH
                        p="px-3 py-3"
                        control={control}
                        register={register}
                        error={getNestedError(errors, 'qualification.high_school_grade')}
                        type="number"
                        placeholder="validation.qualification.high_school_grade.placeholder"
                        disabled={viewMode}
                        label="validation.qualification.high_school_grade.label"
                        name="qualification.high_school_grade"
                    />
                )}
                <InputRFH
                    p="px-3 py-3"
                    control={control}
                    register={register}
                    error={getNestedError(errors, 'qualification.has_bachelors_degree')}
                    type="select"
                    placeholder="validation.qualification.has_bachelors_degree.placeholder"
                    disabled={viewMode}
                    label="validation.qualification.has_bachelors_degree.label"
                    name="qualification.has_bachelors_degree"
                    options={generateOptions(options?.has_bachelors_degree)}
                />
                {Number(hasBachelors) === 1 && (
                    <InputRFH
                        p="px-3 py-3"
                        control={control}
                        register={register}
                        error={getNestedError(errors, 'qualification.major_id')}
                        type="select"
                        placeholder="validation.major_id.placeholder"
                        disabled={viewMode}
                        label="validation.major_id.label"
                        name="qualification.major_id"
                        options={generateOptions(options?.major_id)}
                    />
                )}
                <InputRFH
                    p="px-3 py-3"
                    control={control}
                    register={register}
                    error={getNestedError(errors, 'qualification.has_memorized_quran_5_parts')}
                    type="select"
                    placeholder="validation.qualification.has_memorized_quran_5_parts.placeholder"
                    disabled={viewMode}
                    label="validation.qualification.has_memorized_quran_5_parts.label"
                    name="qualification.has_memorized_quran_5_parts"
                    options={generateOptions(options?.has_memorized_quran_5_parts)}
                />
                {Number(hasMemorizedFive) === 0 && (
                    <InputRFH
                        p="px-3 py-3"
                        control={control}
                        register={register}
                        error={getNestedError(errors, 'qualification.memorized_quran_parts')}
                        type="number"
                        placeholder="validation.qualification.memorized_quran_parts.placeholder"
                        disabled={viewMode}
                        label="validation.qualification.memorized_quran_parts.label"
                        name="qualification.memorized_quran_parts"
                    />
                )}
            </div>
        </div>
    );
}

