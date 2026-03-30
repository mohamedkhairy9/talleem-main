import useRFH from '@/utils/hooks/global/useRFH';
import { employeesSchema as schema } from '@/utils/yup/employees.schemas';
import React, { useEffect, useState } from 'react';
import { employeesFields } from './configs';
import InputRFH from '@/components/common/inputs/InputRFH';
import FileInputRFH from '@/components/common/inputs/FileInputRFH';
import Btn from '@/components/common/buttons/Btn';
import { getNestedError } from '@/utils/helpers/getNestedError';
import { generateOptions, onlyDate } from '@/utils/helpers/global.fns';
import ModalContent from '@/components/common/form/ModalContent';
import ModalFooter from '@/components/common/form/ModalFooter';
import { isFieldRequired } from '@/utils/helpers/schemaHelpers';
import useLocale from '@/utils/hooks/global/useLocale';
import i18next from 'i18next';
import { normalizeRoleName } from '@/utils/helpers/assignableRoles';

const RELATION_FIELDS_VIEW = [
    'nationality_id',
    'city_id',
    'branch_id',
    'entity_id',
    'job_id',
    'academic_qualification_id',
    'major_id',
    'roles'
];

function getRelationDisplayName(oldData, fieldName, lang) {
    if (fieldName === 'roles') {
        const roles = oldData?.roles;
        if (!Array.isArray(roles) || roles.length === 0) return '—';
        const names = roles.map(r => {
            if (typeof r === 'string') return r;
            const n = r?.name;
            return (n && (n[lang] || n.en || n.ar || (typeof n === 'string' ? n : ''))) || '';
        }).filter(Boolean);
        return names.length ? names.join(', ') : '—';
    }
    const obj =
        fieldName === 'nationality_id' ? oldData?.nationality
            : fieldName === 'city_id' ? oldData?.city
                : fieldName === 'branch_id' ? oldData?.branch
                    : fieldName === 'entity_id' ? oldData?.entity
                        : fieldName === 'job_id' ? oldData?.job
                            : fieldName === 'academic_qualification_id' ? oldData?.academic_qualification
                                : fieldName === 'major_id' ? oldData?.major
                                    : null;
    if (!obj?.name) return '—';
    return obj.name[lang] || obj.name.en || obj.name.ar || (typeof obj.name === 'string' ? obj.name : '—');
}

export default function FormEmployee({
    onClose,
    oldData,
    editMode,
    viewMode,
    isPending,
    mutate,
    options
}) {
    const { t } = useLocale();
    const lang = i18next.language;
    const [profileImagePreview, setProfileImagePreview] = useState(
        oldData?.profile_picture || null
    );
    const [profileImageChanged, setProfileImageChanged] = useState(false);

    const { register, errors, handleSubmit, control, setValue, watch } = useRFH({
        schema,
        defaultValues: {
            ...oldData,
            name: oldData?.name || { en: '', ar: '' },
            date_of_birth: onlyDate(oldData?.date_of_birth),
            roles: Array.isArray(oldData?.roles)
                ? oldData.roles.map(r => (typeof r === 'object' && r?.id != null ? r.id : r))
                : oldData?.role_ids ?? []
        }
    });

    const cityId = watch('city_id');
    const branchId = watch('branch_id');
    const jobId = watch('job_id');

    const [isRolesForced, setIsRolesForced] = useState(false);
    const [isCeoJob, setIsCeoJob] = useState(false);

    useEffect(() => {
        if ((branchId && branchId != oldData?.branch_id) || !oldData?.branch_id) {
            setValue('entity_id', '');
        }
    }, [branchId, oldData?.branch_id, setValue]);

    // Auto-set roles based on job selection (supervisor / branch manager / CEO)
    useEffect(() => {
        const rolesList = options?.roles || [];
        const jobsList = options?.job_id || [];

        if (!jobId) {
            setIsRolesForced(false);
            return;
        }

        const job = jobsList.find(j => j.id == jobId);
        if (!job) {
            setIsRolesForced(false);
            return;
        }

        const rawJobName =
            job.name?.en ||
            job.name?.ar ||
            (typeof job.name === 'string' ? job.name : '') ||
            job.label?.en ||
            job.label?.ar ||
            job.label ||
            '';

        const jobName = rawJobName.toString().toLowerCase();

        let targetKey = null;
        if (jobName.includes('supervisor')) {
            targetKey = 'supervisor';
        } else if (jobName.includes('branch') && jobName.includes('manager')) {
            targetKey = 'branch_manager';
        } else if (jobName.includes('ceo') || jobName.includes('general manager') || jobName.includes('director')) {
            targetKey = 'ceo';
        }

        setIsCeoJob(targetKey === 'ceo');

        if (!targetKey) {
            setIsRolesForced(false);
            return;
        }

        const matchRoles = () => {
            const norm = (n) => normalizeRoleName(n);
            if (targetKey === 'supervisor') {
                return rolesList.filter(r => norm(r.name).includes('supervisor'));
            }
            if (targetKey === 'branch_manager') {
                return rolesList.filter(r => {
                    const n = norm(r.name);
                    return n.includes('branch') && n.includes('manager');
                });
            }
            if (targetKey === 'ceo') {
                return rolesList.filter(r => norm(r.name) === 'ceo');
            }
            return [];
        };

        const matching = matchRoles();
        if (!matching.length) {
            setIsRolesForced(false);
            return;
        }

        const roleIds = matching.map(r => r.id);
        setValue('roles', roleIds);
        setIsRolesForced(true);
    }, [jobId, options?.job_id, options?.roles, setValue]);

    function onSubmit(data) {
        // Remove profile_picture if not changed in edit mode
        if (editMode && !profileImageChanged && data.profile_picture) {
            delete data.profile_picture;
        }

        // Extract single file from FileList for profile_picture
        if (data.profile_picture instanceof FileList && data.profile_picture.length > 0) {
            data.profile_picture = data.profile_picture[0];
        } else if (Array.isArray(data.profile_picture) && data.profile_picture.length > 0) {
            data.profile_picture = data.profile_picture[0];
        }

        // Send role names (not ids) as roles[] in form data
        const roleNames = (data.roles || []).map(id => {
            const role = (options?.roles || []).find(r => r.id == id);
            return role?.name ?? String(id);
        });
        const payload = { ...data, roles: roleNames, status: data.status ? 1 : 0 };

        mutate(payload, {
            onSuccess: () => {
                onClose();
            }
        });
    }

    const renderField = field => {
        const fieldName = field.name;
        const error = getNestedError(errors, fieldName);
        let defaultValue = oldData?.[fieldName] ?? field.defaultValue;
        if (fieldName === 'roles' && Array.isArray(oldData?.roles)) {
            defaultValue = oldData.roles.map(r =>
                typeof r === 'object' && r?.name != null ? r.name : r
            );
        }

        // Normalize default value for multi-select entity field
        if (fieldName === 'entity_id' && defaultValue && !Array.isArray(defaultValue)) {
            defaultValue = [defaultValue];
        }

        // View mode: render relation fields as styled name-only fields (from list row data)
        if (viewMode && RELATION_FIELDS_VIEW.includes(fieldName)) {
            const displayName = getRelationDisplayName(oldData, fieldName, lang);
            return (
                <div key={`view-${fieldName}`} className="flex flex-col gap-px">
                    <label className="flex items-center gap-2 font-medium text-gray-700 font-montserrat mb-1">
                        {t(field.label)}
                    </label>
                    <div className="min-h-[44px] rounded-lg border border-gray-300 bg-gray-50 px-3 py-3 flex items-center">
                        <span className="text-gray-900 font-montserrat">{displayName}</span>
                    </div>
                </div>
            );
        }

        if (field.type === 'file') {
            if (field.name === 'profile_picture') {
                return (
                    <div className="space-y-2">
                        <InputRFH
                            p="px-3 py-3"
                            control={control}
                            register={register}
                            error={error}
                            type={field.type}
                            placeholder={field.placeholder}
                            disabled={viewMode}
                            label={field.label}
                            name={fieldName}
                            accept={field.accept}
                            required={isFieldRequired(schema, fieldName)}
                            onChange={e => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    setProfileImageChanged(true);
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                        setProfileImagePreview(reader.result);
                                    };
                                    reader.readAsDataURL(file);
                                }
                            }}
                        />
                        {profileImagePreview && (
                            <div className="mt-2">
                                <img
                                    src={profileImagePreview}
                                    alt="Profile Preview"
                                    className="h-32 w-32 object-cover rounded-full border-2 border-gray-300"
                                />
                            </div>
                        )}
                    </div>
                );
            }
            return (
                <FileInputRFH
                    register={register}
                    control={control}
                    error={error}
                    placeholder={field.placeholder}
                    disabled={viewMode}
                    label={field.label}
                    name={fieldName}
                    multiple={field.multiple}
                    defaultValue={defaultValue || []}
                    setValue={setValue}
                    required={isFieldRequired(schema, fieldName)}
                />
            );
        }

        // Determine if field should be disabled based on dependencies
        const isFieldDisabled =
            viewMode ||
            (fieldName === 'entity_id' && !branchId) ||
            (fieldName === 'roles' && isRolesForced);

        return (
            <InputRFH
                key={fieldName === 'entity_id' ? `entity_id-${branchId ?? 'no-branch'}` : fieldName}
                p="px-3 py-3"
                control={control}
                register={register}
                error={error}
                disabled={isFieldDisabled}
                {...field}
                name={fieldName}
                options={generateOptions(options?.[fieldName])}
                defaultValue={defaultValue}
                required={
                    fieldName === 'entity_id'
                        ? !isCeoJob
                        : isFieldRequired(schema, fieldName)
                }
                oldData={oldData}
                fieldParams={{
                    entity_id: { branch_id: branchId ?? oldData?.branch_id }
                }}
            />
        );
    };

    const filteredFields = employeesFields.filter(
        field =>
            (editMode && field.editMode) ||
            (viewMode && field.viewMode) ||
            (!editMode && !viewMode)
    );

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col h-full"
        >
            <ModalContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFields.map(field => (
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
                        {renderField(field)}
                    </div>
                ))}
            </div>
            </ModalContent>
            {!viewMode && (
                <ModalFooter>
                    <Btn
                        loading={isPending}
                        className="py-[10px] w-full"
                        type="submit"
                        label="common.submit"
                    />
                </ModalFooter>
            )}
        </form>
    );
}
