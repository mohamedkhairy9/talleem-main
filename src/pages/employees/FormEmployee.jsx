import useRFH from '@/utils/hooks/global/useRFH';
import { employeesSchema as schema } from '@/utils/yup/employees.schemas';
import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import { useEntitiesQuery } from '@/api/hooks/useEntities';
import { allData } from '@/utils/constants/global.constants';
import {
    buildEmployeeSubmissionPayload,
    getEmployeeJobPolicyState,
    normalizeSelectedIds
} from './employeeJobPolicy';

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

function getLocalizedName(value, lang) {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return value[lang] || value.en || value.ar || '';
}

function getRelationDisplayName(oldData, fieldName, lang) {
    if (fieldName === 'roles') {
        const roles = oldData?.roles;
        if (!Array.isArray(roles) || roles.length === 0) return '---';
        const names = roles
            .map(role =>
                getLocalizedName(
                    typeof role === 'string' ? role : role?.name,
                    lang
                )
            )
            .filter(Boolean);
        return names.length ? names.join(', ') : '---';
    }

    if (fieldName === 'branch_id') {
        const branches = Array.isArray(oldData?.branches)
            ? oldData.branches
            : oldData?.branch
              ? [oldData.branch]
              : [];
        const names = branches
            .map(branch => getLocalizedName(branch?.name, lang))
            .filter(Boolean);
        return names.length ? names.join(', ') : '---';
    }

    const relationValue =
        fieldName === 'nationality_id'
            ? oldData?.nationality
            : fieldName === 'city_id'
              ? oldData?.city
              : fieldName === 'entity_id'
                ? oldData?.entity
                : fieldName === 'job_id'
                  ? oldData?.job
                  : fieldName === 'academic_qualification_id'
                    ? oldData?.academic_qualification
                    : fieldName === 'major_id'
                      ? oldData?.major
                      : null;

    const displayName = getLocalizedName(relationValue?.name, lang);
    return displayName || '---';
}

function getSelectionKey(value) {
    return normalizeSelectedIds(value)
        .map(item => String(item))
        .sort()
        .join(',');
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
    const normalizedDefaultValues = useMemo(
        () => ({
            ...oldData,
            branch_id: normalizeSelectedIds(
                oldData?.branch_id ?? oldData?.branches ?? oldData?.branch
            ),
            entity_id: normalizeSelectedIds(
                oldData?.entity_id ?? oldData?.entities ?? oldData?.entity
            ),
            roles: Array.isArray(oldData?.roles)
                ? oldData.roles.map(role =>
                      typeof role === 'object' && role?.id != null
                          ? role.id
                          : role
                  )
                : oldData?.role_ids ?? []
        }),
        [oldData]
    );
    const [profileImagePreview, setProfileImagePreview] = useState(
        oldData?.profile_picture || null
    );
    const [profileImageChanged, setProfileImageChanged] = useState(false);

    const { register, errors, handleSubmit, control, setValue, watch } = useRFH({
        schema,
        defaultValues: {
            ...normalizedDefaultValues,
            name: oldData?.name || { en: '', ar: '' },
            date_of_birth: onlyDate(oldData?.date_of_birth)
        }
    });

    const branchId = watch('branch_id');
    const jobId = watch('job_id');
    const previousBranchSelectionRef = useRef(
        getSelectionKey(normalizedDefaultValues.branch_id)
    );
    const previousJobIdRef = useRef(
        editMode || viewMode ? jobId ?? null : null
    );
    const selectedBranchIds = normalizeSelectedIds(branchId);

    const [isRolesForced, setIsRolesForced] = useState(false);
    const [isCeoJob, setIsCeoJob] = useState(false);
    const {
        data: entitiesData,
        isLoading: entitiesLoading
    } = useEntitiesQuery(
        {
            ...allData,
            branches_id: selectedBranchIds
        },
        {
            enabled: selectedBranchIds.length > 0 && !isCeoJob
        }
    );
    const entityOptions = entitiesData?.data ?? [];

    useEffect(() => {
        if (isCeoJob) {
            setValue('entity_id', []);
            previousBranchSelectionRef.current = '';
            return;
        }

        const currentBranchSelection = getSelectionKey(branchId);
        const previousBranchSelection = previousBranchSelectionRef.current;

        if (
            previousBranchSelection &&
            currentBranchSelection !== previousBranchSelection
        ) {
            setValue('entity_id', []);
        }

        previousBranchSelectionRef.current = currentBranchSelection;

        if (!currentBranchSelection) {
            setValue('entity_id', []);
        }
    }, [branchId, isCeoJob, setValue]);

    useEffect(() => {
        const rolesList = options?.roles || [];
        const jobsList = options?.job_id || [];

        if (!jobId) {
            setIsRolesForced(false);
            setIsCeoJob(false);
            previousJobIdRef.current = null;
            return;
        }

        const policyState = getEmployeeJobPolicyState({
            jobId,
            jobs: jobsList,
            roles: rolesList
        });

        setIsCeoJob(policyState.isCeoJob);
        setIsRolesForced(policyState.forceRoles);

        const jobChanged = previousJobIdRef.current !== jobId;

        if (policyState.forceRoles) {
            setValue('roles', policyState.forcedRoleIds);
        } else if (jobChanged && policyState.autoRoleIds.length > 0) {
            setValue('roles', policyState.autoRoleIds);
        }

        previousJobIdRef.current = jobId;
    }, [jobId, options?.job_id, options?.roles, setValue]);

    useEffect(() => {
        if (isCeoJob) {
            setValue('branch_id', []);
            setValue('entity_id', []);
        }
    }, [isCeoJob, setValue]);

    function onSubmit(data) {
        if (editMode && !profileImageChanged && data.profile_picture) {
            delete data.profile_picture;
        }

        if (
            data.profile_picture instanceof FileList &&
            data.profile_picture.length > 0
        ) {
            data.profile_picture = data.profile_picture[0];
        } else if (
            Array.isArray(data.profile_picture) &&
            data.profile_picture.length > 0
        ) {
            data.profile_picture = data.profile_picture[0];
        }

        const payload = buildEmployeeSubmissionPayload(data, options?.roles || []);

        mutate(payload, {
            onSuccess: () => {
                onClose();
            }
        });
    }

    const renderField = field => {
        const fieldName = field.name;
        const error = getNestedError(errors, fieldName);
        const hasBranchSelection = selectedBranchIds.length > 0;
        let defaultValue = oldData?.[fieldName] ?? field.defaultValue;

        if (fieldName === 'branch_id') {
            defaultValue = normalizedDefaultValues.branch_id;
        }

        if (fieldName === 'entity_id') {
            defaultValue = normalizedDefaultValues.entity_id;
        }

        if (viewMode && RELATION_FIELDS_VIEW.includes(fieldName)) {
            const displayName = getRelationDisplayName(oldData, fieldName, lang);
            return (
                <div key={`view-${fieldName}`} className="flex flex-col gap-px">
                    <label className="flex items-center gap-2 font-medium text-gray-700 font-montserrat mb-1">
                        {t(field.label)}
                    </label>
                    <div className="min-h-[44px] rounded-lg border border-gray-300 bg-gray-50 px-3 py-3 flex items-center">
                        <span className="text-gray-900 font-montserrat">
                            {displayName}
                        </span>
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

        const isFieldDisabled =
            viewMode ||
            (fieldName === 'branch_id' && isCeoJob) ||
            (fieldName === 'entity_id' && (isCeoJob || !hasBranchSelection)) ||
            (fieldName === 'roles' && isRolesForced);

        const inputField = (
            <InputRFH
                key={
                    fieldName === 'entity_id'
                        ? `entity_id-${hasBranchSelection ? selectedBranchIds.join(',') : 'no-branch'}`
                        : fieldName
                }
                p="px-3 py-3"
                control={control}
                register={register}
                error={error}
                disabled={isFieldDisabled}
                isAsync={
                    fieldName === 'roles'
                        ? false
                        : fieldName === 'entity_id'
                          ? false
                          : undefined
                }
                loading={fieldName === 'entity_id' ? entitiesLoading : false}
                {...field}
                name={fieldName}
                isMulti={fieldName === 'branch_id' ? true : field.isMulti}
                options={
                    fieldName === 'entity_id'
                        ? generateOptions(entityOptions)
                        : generateOptions(options?.[fieldName])
                }
                defaultValue={defaultValue}
                required={
                    fieldName === 'entity_id'
                        ? !isCeoJob
                        : isFieldRequired(schema, fieldName)
                }
                oldData={oldData}
                fieldParams={{
                    entity_id: hasBranchSelection
                        ? {
                              branches_id: selectedBranchIds
                          }
                        : {
                              branches_id: normalizedDefaultValues.branch_id
                          }
                }}
            />
        );

        if (fieldName !== 'entity_id' || viewMode) {
            return inputField;
        }

        const selectAllLabel =
            lang === 'ar' ? 'اختيار كل الجهات' : 'Select all entities';
        const clearEntitiesLabel =
            lang === 'ar' ? 'مسح الجهات' : 'Clear entities';
        const loadingEntitiesLabel =
            lang === 'ar' ? 'جاري تحميل الجهات...' : 'Loading entities...';

        return (
            <div className="space-y-2">
                {inputField}
                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        className="btn btn-secondary !w-auto px-4 py-2 disabled:opacity-50"
                        disabled={
                            !hasBranchSelection ||
                            entitiesLoading ||
                            entityOptions.length === 0
                        }
                        onClick={() => {
                            setValue(
                                'entity_id',
                                entityOptions.map(entity => entity.id)
                            );
                        }}
                    >
                        {selectAllLabel}
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline !w-auto px-4 py-2 disabled:opacity-50"
                        disabled={!hasBranchSelection}
                        onClick={() => {
                            setValue('entity_id', []);
                        }}
                    >
                        {clearEntitiesLabel}
                    </button>
                    {entitiesLoading && (
                        <span className="text-sm text-gray-500 self-center">
                            {loadingEntitiesLabel}
                        </span>
                    )}
                </div>
            </div>
        );
    };

    const filteredFields = employeesFields.filter(
        field =>
            (editMode && field.editMode) ||
            (viewMode && field.viewMode) ||
            (!editMode && !viewMode)
    );

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
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
