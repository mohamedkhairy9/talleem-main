import React, { useMemo, useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import Table from '@/components/common/table/Table';
import NameCell from '@/components/common/table/cells/NameCell';
import Cell from '@/components/common/table/cells/Cell';
import DateCell from '@/components/common/table/cells/DateCell';
import WarningModal from '@/components/common/form/WarningModal';
import IssueLicenseModal from '@/components/licenses/IssueLicenseModal';
import useLocale from '@/utils/hooks/global/useLocale';
import usePagination from '@/utils/hooks/global/usePagination';
import { getLocalizedErrorMessage } from '@/utils/helpers/localizedMessages';
import {
    usePendingTeacherLicensesQuery,
    useRenewTeacherLicenseMutation
} from '@/api/hooks/useTeachers';
import {
    usePendingEntityLicensesQuery,
    useRenewEntityLicenseMutation
} from '@/api/hooks/useEntities';

const columnHelper = createColumnHelper();

const firstNonEmpty = (...values) =>
    values.find(value => value !== undefined && value !== null && value !== '');

const firstObject = (...values) =>
    values.find(value => value && typeof value === 'object' && !Array.isArray(value));

const getLocalizedValue = value => {
    if (value == null || value === '') return value;
    if (typeof value === 'object' && !Array.isArray(value)) {
        return firstNonEmpty(value.ar, value.en, value.name, value.label, value.value);
    }
    return value;
};

const getDisplayDate = value => {
    if (value == null || value === '') return value;
    if (typeof value === 'object' && !Array.isArray(value)) {
        return firstNonEmpty(value.gregorian, value.hijri, value.hijri_indic);
    }
    return value;
};

const extractCollection = response => {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.items)) return response.items;
    if (Array.isArray(response?.results)) return response.results;
    if (Array.isArray(response?.licenses)) return response.licenses;
    if (Array.isArray(response?.data?.data)) return response.data.data;
    return [];
};

const normalizeStatus = value => {
    if (value == null || value === '') return 'pending';
    return String(value).toLowerCase();
};

const getStatusStyles = status => {
    const normalized = normalizeStatus(status);

    if (normalized.includes('active')) return 'bg-green-100 text-green-800 border-green-200';
    if (normalized.includes('expired')) return 'bg-red-100 text-red-800 border-red-200';
    if (normalized.includes('pending')) return 'bg-yellow-100 text-yellow-800 border-yellow-200';

    return 'bg-gray-100 text-gray-700 border-gray-200';
};

const getLocalizedStatus = (status, currentLocale) => {
    const normalized = normalizeStatus(status);

    if (currentLocale === 'ar') {
        if (normalized.includes('active')) return 'نشط';
        if (normalized.includes('expired')) return 'منتهية';
        if (normalized.includes('pending')) return 'قيد التجديد';
    }

    if (normalized.includes('active')) return 'Active';
    if (normalized.includes('expired')) return 'Expired';
    if (normalized.includes('pending')) return 'Pending Renewal';

    return status || '-';
};

function StatusBadge({ status, currentLocale }) {
    return (
        <span
            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyles(
                status
            )}`}
        >
            {getLocalizedStatus(status, currentLocale)}
        </span>
    );
}

const normalizeTeacherPendingItem = (item, index) => {
    const submittedData = firstObject(item.submitted_data, item.submittedData, item.payload);
    const teacher = firstObject(
        item.teacher,
        item.teacher_profile,
        item.teacher_data,
        item.profile,
        item.user,
        submittedData?.teacher
    );
    const branch = firstObject(
        teacher?.branch,
        item.branch,
        submittedData?.current_branch,
        submittedData?.new_branch
    );
    const mainProgram = firstObject(
        teacher?.main_program,
        item.main_program,
        submittedData?.main_program,
        submittedData?.program
    );

    return {
        id: firstNonEmpty(item.id, `teacher-license-${index}`),
        renew_target_id: firstNonEmpty(
            item.teacher_id,
            teacher?.id,
            item.teacherId,
            submittedData?.teacher_id,
            submittedData?.current_teacher_id,
            item.licenseable_id,
            typeof item.id === 'number' ? item.id : null
        ),
        display_name: firstNonEmpty(
            getLocalizedValue(teacher?.name),
            item.teacher_name,
            item.name,
            teacher?.full_name,
            getLocalizedValue(submittedData?.name)
        ),
        phone: firstNonEmpty(teacher?.phone, teacher?.user?.phone, item.phone),
        branch: firstNonEmpty(
            getLocalizedValue(branch?.name),
            getLocalizedValue(item.branch_name),
            item.branch_name
        ),
        main_program: firstNonEmpty(
            getLocalizedValue(mainProgram?.name),
            getLocalizedValue(item.main_program_name),
            item.main_program_name
        ),
        license_number: firstNonEmpty(
            item.license_number,
            teacher?.license_number,
            item.current_license_number,
            submittedData?.license_number
        ),
        expiration_date: firstNonEmpty(
            getDisplayDate(item.expiration_date),
            getDisplayDate(item.license_expiration_date),
            getDisplayDate(teacher?.license_expiration_date),
            getDisplayDate(submittedData?.expiration_date)
        ),
        status: firstNonEmpty(
            item.status,
            item.status_text,
            item.license_status,
            teacher?.status,
            'pending'
        )
    };
};

const normalizeEntityPendingItem = (item, index) => {
    const submittedData = firstObject(item.submitted_data, item.submittedData, item.payload);
    const entity = firstObject(
        item.entity,
        item.entity_profile,
        item.entity_data,
        item.organization,
        submittedData?.entity,
        submittedData?.new_entity,
        submittedData?.current_entity
    );
    const teacher = firstObject(submittedData?.teacher);
    const branch = firstObject(
        entity?.branch,
        item.branch,
        submittedData?.new_branch,
        submittedData?.current_branch,
        teacher?.branch
    );
    const mainProgram = firstObject(
        entity?.main_program,
        item.main_program,
        submittedData?.main_program,
        submittedData?.program
    );

    return {
        id: firstNonEmpty(item.id, `entity-license-${index}`),
        renew_target_id: firstNonEmpty(
            item.entity_id,
            item.entityId,
            submittedData?.current_entity_id,
            submittedData?.entity_id,
            submittedData?.current_entity?.id,
            entity?.id,
            item.licenseable_id,
            typeof item.id === 'number' ? item.id : null
        ),
        display_name: firstNonEmpty(
            getLocalizedValue(entity?.name),
            item.entity_name,
            item.name,
            getLocalizedValue(submittedData?.name)
        ),
        phone: firstNonEmpty(entity?.phone, teacher?.phone, item.phone),
        branch: firstNonEmpty(
            getLocalizedValue(branch?.name),
            getLocalizedValue(item.branch_name),
            item.branch_name
        ),
        main_program: firstNonEmpty(
            getLocalizedValue(mainProgram?.name),
            getLocalizedValue(item.main_program_name),
            item.main_program_name
        ),
        license_number: firstNonEmpty(
            item.license_number,
            entity?.license_number,
            item.current_license_number,
            submittedData?.license_number
        ),
        expiration_date: firstNonEmpty(
            getDisplayDate(item.expiration_date),
            getDisplayDate(item.license_expiration_date),
            getDisplayDate(entity?.license_expiration_date),
            getDisplayDate(submittedData?.expiration_date)
        ),
        status: firstNonEmpty(
            item.status,
            item.status_text,
            item.license_status,
            entity?.status,
            'pending'
        )
    };
};

export default function LicenseRenewals() {
    const { currentLocale } = useLocale();
    const [activeTab, setActiveTab] = useState('teachers');
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [selectedEntity, setSelectedEntity] = useState(null);
    const [actionError, setActionError] = useState('');
    const { pagination: teachersPagination, setPagination: setTeachersPagination } =
        usePagination();
    const { pagination: entitiesPagination, setPagination: setEntitiesPagination } =
        usePagination();

    const {
        data: pendingTeachersResponse,
        isLoading: isTeachersLoading,
        refresh: refreshTeachers,
        hasError: hasTeachersError,
        errorMessage: teachersErrorMessage
    } = usePendingTeacherLicensesQuery();
    const {
        data: pendingEntitiesResponse,
        isLoading: isEntitiesLoading,
        refresh: refreshEntities,
        hasError: hasEntitiesError,
        errorMessage: entitiesErrorMessage
    } = usePendingEntityLicensesQuery();
    const { mutate: renewTeacherLicense, isPending: isRenewingTeacher } =
        useRenewTeacherLicenseMutation();
    const { mutate: renewEntityLicense, isPending: isRenewingEntity } =
        useRenewEntityLicenseMutation();

    const pendingTeachers = useMemo(
        () => extractCollection(pendingTeachersResponse).map(normalizeTeacherPendingItem),
        [pendingTeachersResponse]
    );
    const pendingEntities = useMemo(
        () => extractCollection(pendingEntitiesResponse).map(normalizeEntityPendingItem),
        [pendingEntitiesResponse]
    );

    const teacherColumns = useMemo(
        () => [
            columnHelper.accessor('display_name', {
                header: 'table_headers.name',
                cell: info => <NameCell directValue={info.row.original.display_name} />
            }),
            columnHelper.accessor('phone', {
                header: 'table_headers.phone',
                cell: info => <Cell value={info.getValue() || '-'} />
            }),
            columnHelper.accessor('branch', {
                header: 'table_headers.branch',
                cell: info => <Cell value={info.getValue() || '-'} />
            }),
            columnHelper.accessor('main_program', {
                header: 'table_headers.main_program',
                cell: info => <Cell value={info.getValue() || '-'} />
            }),
            columnHelper.accessor('license_number', {
                header: 'table_headers.license_number',
                cell: info => <Cell value={info.getValue() || '-'} />
            }),
            columnHelper.accessor('expiration_date', {
                header: currentLocale === 'ar' ? 'تاريخ الانتهاء' : 'Expiry Date',
                cell: info => <DateCell value={info.getValue()} />
            }),
            columnHelper.accessor('status', {
                header: 'table_headers.status',
                cell: info => (
                    <StatusBadge
                        status={info.getValue()}
                        currentLocale={currentLocale}
                    />
                )
            }),
            columnHelper.display({
                id: 'renew_action',
                header: currentLocale === 'ar' ? 'التجديد' : 'Renew',
                cell: info => {
                    const row = info.row.original;
                    const canRenew = !!row.renew_target_id;

                    return (
                        <button
                            type="button"
                            disabled={!canRenew || isRenewingTeacher}
                            onClick={() => setSelectedTeacher(row)}
                            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                                canRenew
                                    ? 'bg-primary text-white hover:opacity-90'
                                    : 'cursor-not-allowed bg-gray-200 text-gray-500'
                            }`}
                        >
                            {currentLocale === 'ar' ? 'تجديد' : 'Renew'}
                        </button>
                    );
                }
            })
        ],
        [currentLocale, isRenewingTeacher]
    );

    const entityColumns = useMemo(
        () => [
            columnHelper.accessor('display_name', {
                header: 'table_headers.name',
                cell: info => <NameCell directValue={info.row.original.display_name} />
            }),
            columnHelper.accessor('phone', {
                header: 'table_headers.phone',
                cell: info => <Cell value={info.getValue() || '-'} />
            }),
            columnHelper.accessor('branch', {
                header: 'table_headers.branch',
                cell: info => <Cell value={info.getValue() || '-'} />
            }),
            columnHelper.accessor('main_program', {
                header: 'table_headers.main_program',
                cell: info => <Cell value={info.getValue() || '-'} />
            }),
            columnHelper.accessor('license_number', {
                header: 'table_headers.license_number',
                cell: info => <Cell value={info.getValue() || '-'} />
            }),
            columnHelper.accessor('expiration_date', {
                header: currentLocale === 'ar' ? 'تاريخ الانتهاء' : 'Expiry Date',
                cell: info => <DateCell value={info.getValue()} />
            }),
            columnHelper.accessor('status', {
                header: 'table_headers.status',
                cell: info => (
                    <StatusBadge
                        status={info.getValue()}
                        currentLocale={currentLocale}
                    />
                )
            }),
            columnHelper.display({
                id: 'renew_action',
                header: currentLocale === 'ar' ? 'التجديد' : 'Renew',
                cell: info => {
                    const row = info.row.original;
                    const canRenew = !!row.renew_target_id;

                    return (
                        <button
                            type="button"
                            disabled={!canRenew || isRenewingEntity}
                            onClick={() => setSelectedEntity(row)}
                            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                                canRenew
                                    ? 'bg-primary text-white hover:opacity-90'
                                    : 'cursor-not-allowed bg-gray-200 text-gray-500'
                            }`}
                        >
                            {currentLocale === 'ar' ? 'تجديد' : 'Renew'}
                        </button>
                    );
                }
            })
        ],
        [currentLocale, isRenewingEntity]
    );

    const currentConfig =
        activeTab === 'teachers'
            ? {
                  title:
                      currentLocale === 'ar'
                          ? 'الرخص المعلقة للمدرسين'
                          : 'Pending Teacher Renewals',
                  data: pendingTeachers,
                  columns: teacherColumns,
                  loading: isTeachersLoading,
                  pagination: teachersPagination,
                  setPagination: setTeachersPagination,
                  refresh: refreshTeachers,
                  hasError: hasTeachersError,
                  errorMessage: teachersErrorMessage
              }
            : {
                  title:
                      currentLocale === 'ar'
                          ? 'الرخص المعلقة للكيانات'
                          : 'Pending Entity Renewals',
                  data: pendingEntities,
                  columns: entityColumns,
                  loading: isEntitiesLoading,
                  pagination: entitiesPagination,
                  setPagination: setEntitiesPagination,
                  refresh: refreshEntities,
                  hasError: hasEntitiesError,
                  errorMessage: entitiesErrorMessage
              };

    const handleTeacherRenew = () => {
        if (!selectedTeacher?.renew_target_id) return;

        setActionError('');

        renewTeacherLicense(selectedTeacher.renew_target_id, {
            onSuccess: () => {
                setSelectedTeacher(null);
            },
            onError: error => {
                setActionError(
                    getLocalizedErrorMessage(error) ||
                        (currentLocale === 'ar'
                            ? 'فشل تجديد رخصة المدرس.'
                            : 'Failed to renew teacher license.')
                );
            }
        });
    };

    const handleEntityRenew = values => {
        if (!selectedEntity?.renew_target_id) return;

        setActionError('');

        renewEntityLicense(
            {
                entityId: selectedEntity.renew_target_id,
                data: values
            },
            {
                onSuccess: () => {
                    setSelectedEntity(null);
                },
                onError: error => {
                    setActionError(
                        getLocalizedErrorMessage(error) ||
                            (currentLocale === 'ar'
                                ? 'فشل تجديد رخصة الكيان.'
                                : 'Failed to renew entity license.')
                    );
                }
            }
        );
    };

    return (
        <div className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {currentLocale === 'ar'
                                ? 'إدارة تجديد الرخص'
                                : 'License Renewals'}
                        </h1>
                        <p className="mt-2 text-sm text-gray-600">
                            {currentLocale === 'ar'
                                ? 'تابع كل الرخص المعلقة وجدّدها من مكان واحد للمدرسين والكيانات.'
                                : 'Track all pending licenses and renew them from one place for teachers and entities.'}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                setActiveTab('teachers');
                                setActionError('');
                            }}
                            className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                                activeTab === 'teachers'
                                    ? 'border-primary bg-primary text-white'
                                    : 'border-gray-200 bg-white text-gray-700 hover:border-primary/40'
                            }`}
                        >
                            {currentLocale === 'ar'
                                ? `المدرسون (${pendingTeachers.length})`
                                : `Teachers (${pendingTeachers.length})`}
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setActiveTab('entities');
                                setActionError('');
                            }}
                            className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                                activeTab === 'entities'
                                    ? 'border-primary bg-primary text-white'
                                    : 'border-gray-200 bg-white text-gray-700 hover:border-primary/40'
                            }`}
                        >
                            {currentLocale === 'ar'
                                ? `الكيانات (${pendingEntities.length})`
                                : `Entities (${pendingEntities.length})`}
                        </button>
                    </div>
                </div>
            </div>

            {currentConfig.hasError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {currentConfig.errorMessage ||
                        (currentLocale === 'ar'
                            ? 'حدث خطأ أثناء تحميل البيانات.'
                            : 'An error occurred while loading data.')}
                </div>
            )}

            {actionError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {actionError}
                </div>
            )}

            <Table
                title={currentConfig.title}
                data={currentConfig.data}
                columns={currentConfig.columns}
                loading={currentConfig.loading}
                refresh={currentConfig.refresh}
                pagination={currentConfig.pagination}
                setPagination={currentConfig.setPagination}
                totalCount={currentConfig.data.length}
                enableAdd={false}
                enableEdit={false}
                enableDelete={false}
                enableCopy={false}
                enableView={false}
                enableExport={false}
                enableRowSelection={false}
            />

            {selectedTeacher && (
                <WarningModal
                    onConfirm={handleTeacherRenew}
                    onCancel={() => setSelectedTeacher(null)}
                    loading={isRenewingTeacher}
                    title={
                        currentLocale === 'ar'
                            ? 'تأكيد تجديد رخصة المدرس'
                            : 'Confirm Teacher License Renewal'
                    }
                    message={
                        currentLocale === 'ar'
                            ? `هل تريد تجديد رخصة ${
                                  typeof selectedTeacher.display_name === 'object'
                                      ? selectedTeacher.display_name.ar ||
                                        selectedTeacher.display_name.en
                                      : selectedTeacher.display_name || 'هذا المدرس'
                              }؟`
                            : `Do you want to renew the license for ${
                                  typeof selectedTeacher.display_name === 'object'
                                      ? selectedTeacher.display_name.en ||
                                        selectedTeacher.display_name.ar
                                      : selectedTeacher.display_name || 'this teacher'
                              }?`
                    }
                    confirmLabel={currentLocale === 'ar' ? 'تجديد' : 'Renew'}
                    cancelLabel="common.cancel"
                />
            )}

            {selectedEntity && (
                <IssueLicenseModal
                    onClose={() => setSelectedEntity(null)}
                    onSubmit={handleEntityRenew}
                    isPending={isRenewingEntity}
                    title={
                        currentLocale === 'ar'
                            ? 'تجديد رخصة الكيان'
                            : 'Renew Entity License'
                    }
                    submitLabel={currentLocale === 'ar' ? 'تجديد الرخصة' : 'Renew License'}
                    notesLabel={currentLocale === 'ar' ? 'ملاحظات' : 'Notes'}
                    issueDateLabel={
                        currentLocale === 'ar' ? 'تاريخ الإصدار' : 'Issue Date'
                    }
                    notesPlaceholder={
                        currentLocale === 'ar'
                            ? 'اكتب ملاحظات التجديد'
                            : 'Enter renewal notes'
                    }
                    issueDatePlaceholder={
                        currentLocale === 'ar'
                            ? 'اختر تاريخ الإصدار'
                            : 'Select issue date'
                    }
                />
            )}
        </div>
    );
}
