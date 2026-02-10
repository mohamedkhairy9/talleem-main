import InputRFH from '@/components/common/inputs/InputRFH';
import { getNestedError } from '@/utils/helpers/getNestedError';
import { generateOptions } from '@/utils/helpers/global.fns';
import useLocale from '@/utils/hooks/global/useLocale';

export default function ParentInformationSection({
    fields,
    control,
    register,
    errors,
    viewMode,
    options,
    isConditionallyRequired
}) {
    const { t } = useLocale();

    if (!fields || fields.length === 0) return null;

    return (
        <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
                {t('students.parent_information')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border border-gray-200 rounded-lg">
                {fields.map(field => (
                    <div key={field.name}>
                        <InputRFH
                            p="px-3 py-3"
                            control={control}
                            register={register}
                            error={getNestedError(errors, field.name)}
                            type={field.type}
                            placeholder={field.placeholder}
                            disabled={viewMode}
                            label={field.label}
                            name={field.name}
                            info={field.info}
                            options={generateOptions(options[field.name])}
                            required={isConditionallyRequired(field)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

