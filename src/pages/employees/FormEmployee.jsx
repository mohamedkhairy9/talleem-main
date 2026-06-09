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
import { extractSearchableTexts } from '@/utils/helpers/assignableRoles';

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

function containsAllWords(text, words) {
    return words.every(word => text.includes(word));
}

const JOB_POLICY_MATCHERS = {
    supervisor: [
        text => text === 'supervisor',
        text => text.includes('supervisor'),
        text => text === 'مشرف'
    ],
    branch_manager: [
        text => text === 'branch manager',
        text => text.includes('branch manager'),
        text => text === 'branchmanager',
        text => containsAllWords(text, ['branch', 'manager']),
        text => text === 'مدير فرع',
        text => containsAllWords(text, ['مدير', 'فرع'])
    ],
    ceo: [
        text => text === 'ceo',
        text => text === 'chief executive officer',
        text => containsAllWords(text, ['chief', 'executive', 'officer']),
        text => text === 'general manager',
        text => containsAllWords(text, ['general', 'manager']),
        text => text.includes('director'),
        text => text === 'رئيس تنفيذي',
        text => containsAllWords(text, ['رئيس', 'تنفيذي']),
        text => text === 'مدير عام',
        text => containsAllWords(text, ['مدير', 'عام'])
    ]
};

function matchesPolicy(text, policyKey) {
    return (JOB_POLICY_MATCHERS[policyKey] || []).some(matcher => matcher(text));
}

function resolveJobPolicy(job) {
    const searchableTexts = extractSearchableTexts(
        job?.name,
        job?.label,
        job?.display_name,
        job?.slug,
        job?.code
    );

    if (searchableTexts.some(text => matchesPolicy(text, 'supervisor'))) {
        return 'supervisor';
    }

    if (searchableTexts.some(text => matchesPolicy(text, 'branch_manager'))) {
        return 'branch_manager';
    }

    if (searchableTexts.some(text => matchesPolicy(text, 'ceo'))) {
        return 'ceo';
    }

    return null;
}

function roleMatchesPolicy(role, policyKey) {
    const searchableTexts = extractSearchableTexts(
        role?.name,
        role?.display_name,
        role?.label,
        role?.slug,
        role?.code
    );

    if (!searchableTexts.length || !policyKey) return false;

    return searchableTexts.some(text => matchesPolicy(text, policyKey));
}

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
    const [isSupervisorJob, setIsSupervisorJob] = useState(false);
    const [isCeoJob, setIsCeoJob] = useState(false);
    const [isBranchManagerJob, setIsBranchManagerJob] = useState(false);
    const isMultiBranchJob = isSupervisorJob || isBranchManagerJob;

    // When branch selection changes, clear entities if no branch is selected
    useEffect(() => {
        if (isCeoJob) {
            setValue('entity_id', []);
            return;
        }

        const hasBranchSelection = Array.isArray(branchId)
            ? branchId.length > 0
            : !!branchId;
        if (!hasBranchSelection) {
            setValue('entity_id', []);
        }
    }, [branchId, isCeoJob, setValue]);

    // Auto-set roles based on job selection (supervisor / branch manager / CEO)
    useEffect(() => {
        const rolesList = options?.roles || [];
        const jobsList = options?.job_id || [];

        if (!jobId) {
            setIsRolesForced(false);
            setIsSupervisorJob(false);
            setIsCeoJob(false);
            setIsBranchManagerJob(false);
            return;
        }

        const job = jobsList.find(j => j.id == jobId);
        if (!job) {
            setIsRolesForced(false);
            setIsSupervisorJob(false);
            setIsCeoJob(false);
            setIsBranchManagerJob(false);
            return;
        }

        const targetKey = resolveJobPolicy(job);

        setIsSupervisorJob(targetKey === 'supervisor');
        setIsCeoJob(targetKey === 'ceo');
        setIsBranchManagerJob(targetKey === 'branch_manager');

        if (!targetKey) {
            setIsRolesForced(false);
            return;
        }

        const matchRoles = () => {
            return rolesList.filter(role => roleMatchesPolicy(role, targetKey));
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

    // Enforce branch/entity restrictions based on job type.
    useEffect(() => {
        if (isCeoJob) {
            setValue('branch_id', null);
            setValue('entity_id', []);
            return;
        }

        if (isMultiBranchJob) {
            const normalizedBranches = Array.isArray(branchId)
                ? branchId
                : branchId
                    ? [branchId]
                    : [];
            if (
                !Array.isArray(branchId) ||
                normalizedBranches.length !== branchId.length
            ) {
                setValue('branch_id', normalizedBranches);
            }
            return;
        }

        if (Array.isArray(branchId)) {
            setValue('branch_id', branchId[0] ?? null);
        }
    }, [branchId, isCeoJob, isMultiBranchJob, setValue]);

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

        // Normalize default value for multi-select branch field when job is branch manager
        if (fieldName === 'branch_id' && isMultiBranchJob && defaultValue && !Array.isArray(defaultValue)) {
            defaultValue = [defaultValue];
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
        const hasBranchSelection = Array.isArray(branchId)
            ? branchId.length > 0
            : !!branchId;
        const isFieldDisabled =
            viewMode ||
            (fieldName === 'branch_id' && isCeoJob) ||
            (fieldName === 'entity_id' && (isCeoJob || !hasBranchSelection)) ||
            (fieldName === 'roles' && isRolesForced);

        return (
            <InputRFH
                key={
                    fieldName === 'entity_id'
                        ? `entity_id-${
                              hasBranchSelection
                                  ? Array.isArray(branchId)
                                      ? branchId.join(',')
                                      : String(branchId ?? 'none')
                                  : 'no-branch'
                          }`
                        : fieldName
                }
                p="px-3 py-3"
                control={control}
                register={register}
                error={error}
                disabled={isFieldDisabled}
                isAsync={fieldName === 'roles' ? false : undefined}
                {...field}
                name={fieldName}
                isMulti={fieldName === 'branch_id' ? isMultiBranchJob : field.isMulti}
                options={generateOptions(options?.[fieldName])}
                defaultValue={defaultValue}
                required={
                    fieldName === 'entity_id'
                        ? !isCeoJob
                        : isFieldRequired(schema, fieldName)
                }
                oldData={oldData}
                fieldParams={{
                    entity_id: Array.isArray(branchId)
                        ? {
                              // When branch is multi-select (branch manager), send all ids as branches_id[]
                              branches_id: branchId
                          }
                        : {
                              // Fallback for single-branch selection
                              branch_id: branchId ?? oldData?.branch_id
                          }
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
