import React from 'react';
import {
    useEntitiesQuery,
    useUnlicensedEntitiesQuery,
    useExportExampleFileMutation
} from '@/api/hooks/useEntities';
import Table from '@/components/common/table/Table';
import { entitiesColumns, filtersDefaultValues } from './configs';
import useIsOpen from '@/utils/hooks/global/useIsOpen';
import useFiltering from '@/utils/hooks/global/useFiltering';
import CreateEntity from './CreateEntity';
import EditEntity from './EditEntity';
import DeleteEntity from './DeleteEntity';
import ViewEntity from './ViewEntity';
import ImportEntity from './ImportEntity';
import useLocale from '@/utils/hooks/global/useLocale';
import { getOriginalObject, onlyDate } from '@/utils/helpers/global.fns';
import Filters from './Filters';
import useExportExample from '@/utils/hooks/global/useExportExample';
import i18next from 'i18next';
import { allData } from '@/utils/constants/global.constants';
import { useUserStore } from '@/utils/stores/user.store';
import {
    filterProfilesByBranch,
    getBranchManagerAssignedBranchId,
    isBranchManagerScopedUser
} from '@/utils/helpers/branchManagerScope';

const extractCollection = response => {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.items)) return response.items;
    if (Array.isArray(response?.results)) return response.results;
    if (Array.isArray(response?.entities)) return response.entities;
    return [];
};

const getLocalizedName = value => {
    if (!value) return '';
    if (typeof value === 'string') return value;

    return (
        value?.[i18next.language] ||
        value?.ar ||
        value?.en ||
        ''
    );
};

export default function Entities() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, handleFilter, filters, setter, setFilters } =
        useFiltering(filtersDefaultValues);
    const currentUser = useUserStore(state => state.user);
    const isBranchManager = isBranchManagerScopedUser(currentUser);
    const assignedBranchId = getBranchManagerAssignedBranchId(currentUser);
    const canLoadProfiles = !isBranchManager || Boolean(assignedBranchId);
    const scopedFilters = React.useMemo(
        () =>
            isBranchManager
                ? {
                      ...filters,
                      branch_id: assignedBranchId,
                      ...allData
                  }
                : filters,
        [assignedBranchId, filters, isBranchManager]
    );
    const isUnauthorizedView = filters?.status === 'unauthorized';
    const {
        data: entitiesResponse,
        isLoading: isEntitiesLoading,
        refresh: refreshEntities
    } = useEntitiesQuery(scopedFilters, {
        enabled: !isUnauthorizedView && canLoadProfiles
    });
    const {
        data: unlicensedEntitiesResponse,
        isLoading: isUnlicensedEntitiesLoading,
        refresh: refreshUnlicensedEntities
    } = useUnlicensedEntitiesQuery(scopedFilters, {
        enabled: isUnauthorizedView && canLoadProfiles
    });
    const { t } = useLocale();
    const { mutate } = useExportExampleFileMutation();
    const { handleExportExample } = useExportExample({mutate, filename: 'entities_example.xlsx'});
    const sourceResponse = isUnauthorizedView
        ? unlicensedEntitiesResponse
        : entitiesResponse;
    const dataList = extractCollection(sourceResponse);
    const scopedDataList = isBranchManager
        ? filterProfilesByBranch(dataList, assignedBranchId)
        : dataList;
    const isLoading = isUnauthorizedView
        ? isUnlicensedEntitiesLoading
        : isEntitiesLoading;
    const refresh = isUnauthorizedView
        ? refreshUnlicensedEntities
        : refreshEntities;
    const totalCount =
        sourceResponse?.meta?.total ??
        sourceResponse?.total ??
        sourceResponse?.data?.length ??
        dataList.length;
    
    const tableData = scopedDataList.map(item => ({
        ...item,
        name: getLocalizedName(item.name),
        branch: getLocalizedName(item.branch?.name ?? item.branch),
        main_program: getLocalizedName(
            item.main_program?.name ?? item.main_program
        ),
        location_type: getLocalizedName(
            item.location_type?.name ??
                item.locationType?.name ??
                item.site_type?.name ??
                item.site_type
        ),
        manager_city: getLocalizedName(
            item.manager?.city?.name ??
                item.manager?.manager_city?.name ??
                item.manager?.city_name ??
                item.manager_city?.name ??
                item.manager_city
        )
    }));

    const formData = scopedDataList.map(item => ({
        id: item.id,
        name: {
            en: item.name?.en,
            ar: item.name?.ar
        },
        status: item.status,
        city_id: item.city?.id,
        neighborhood_id: item.neighborhood?.id,
        branch_id: item.branch?.id,
        main_program_id: item.main_program?.id,
        session_mode_id: item.session_mode?.id, 
        education_program_entity_type_classification: null, // Will be set in FormEntity based on entity_category_id
        entity_category_id:
            item.main_program?.id == 1
                ? item.education_program_entity_type?.id
                : item.main_program?.id == 2
                ? item.memorization_program_entity_type?.id
                : null,
        location_type_id: item.location_type?.id || item.location_type_id,
        min_acceptance_age: item.min_acceptance_age,
        phone: item.phone,
        email: item.email,
        address: item.address,
        area: item.area,
        class_count: item.class_count ?? 0,
        management_rooms_count: item.management_rooms_count ?? 0,
        lecture_halls_count: item.lecture_halls_count ?? 0,
        activity_ids: item.activities?.map(activity => activity.id),
        registration_date: onlyDate(item.registration_date),
        entry_type: item.entry_type,
        license_number: item.license_number,
        files: item.files,
        latitude: item.latitude,
        longitude: item.longitude,
        manager: {
            name: {
                en: item.manager?.name?.en,
                ar: item.manager?.name?.ar
            },
            status: item.manager?.user?.status ?? item.manager?.status,
            manager_email: item.manager?.manager_email,
            manager_phone: item.manager?.manager_phone,
            national_id: item.manager?.national_id,
            gender: item.manager?.gender,
            nationality_id: item.manager?.nationality != null ? Number(item.manager.nationality.id) : undefined,
            nationality: item.manager?.nationality ?? undefined,
            city_id: item.manager?.city?.id,
            academic_qualification_id: item.manager?.academic_qualification_id,
            specification_id: item.manager?.specification_id,
            date_of_birth: onlyDate(item.manager?.date_of_birth),
            address: item.manager?.address,
            memorization_amount: item.manager?.memorization_amount,
            years_of_experience: item.manager?.years_of_experience,
            profile_image: item.manager?.profile_image,
            files: item.manager?.files
        }
    }));

    return (
        <div>
            <Table
                resource="entities"
                title={t('table_titles.entities')}
                refresh={refresh}
                loading={isLoading}
                data={tableData}
                serverPagination={!isBranchManager}
                totalCount={isBranchManager ? scopedDataList.length : totalCount}
                columns={entitiesColumns}
                toggleModals={toggle}
                pagination={pagination}
                setPagination={setter('pagination')}
                Filters={
                    <Filters filters={filters} handleFilter={handleFilter} />
                }
                setFilters={setFilters}
                filters={filters}
                enableImport={true}
                enableExportExample={true}
                onImport={toggle.import}
                onExportExample={handleExportExample}
            />
            {isOpen.add && <CreateEntity onClose={toggle.add} />}
            {isOpen.edit && (
                <EditEntity
                    onClose={toggle.edit}
                    oldData={getOriginalObject(isOpen.edit, formData)}
                />
            )}
            {isOpen.view && (
                <ViewEntity
                    onClose={toggle.view}
                    oldData={getOriginalObject(isOpen.view, formData)}
                />
            )}
            {isOpen.delete && (
                <DeleteEntity onClose={toggle.delete} id={isOpen.delete?.id} />
            )}
            {isOpen.import && <ImportEntity onClose={toggle.import} />}
        </div>
    );
}
