import React from 'react';
import {
    useEntitiesQuery,
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
import { getOriginalObject } from '@/utils/helpers/global.fns';
import Filters from './Filters';
import useExportExample from '@/utils/hooks/global/useExportExample';
import i18next from 'i18next';

export default function Entities() {
    const { isOpen, toggle } = useIsOpen();
    const { pagination, handleFilter, filters, setter, setFilters } =
        useFiltering(filtersDefaultValues);
    const { data, isLoading, refresh } = useEntitiesQuery(filters);
    const { t } = useLocale();
    const { mutate } = useExportExampleFileMutation();
    const { handleExportExample } = useExportExample({mutate, filename: 'entities_example.xlsx'});
    
    const tableData = data?.data?.map(item => ({
        ...item,
        name: item.name?.[i18next.language],
        branch: item.branch?.name?.[i18next.language],
        main_program: item.main_program?.name?.[i18next.language]
    }));

    console.log(data?.data?.[0])
    const formData = data?.data?.map(item => ({
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
        location_type_id: item.location_type?.id,
        min_acceptance_age: item.min_acceptance_age,
        phone: item.phone,
        email: item.email,
        address: item.address,
        area: item.area,
        class_count: item.class_count,
        management_rooms_count: item.management_rooms_count,
        lecture_holes_count: item.lecture_holes_count,
        activity_ids: item.activities?.map(activity => activity.id),
        registration_date: item.registration_date,
        license_number: item.license_number,
        files: item.files,
        latitude: item.latitude,
        longitude: item.longitude,
        manager: {
            name: {
                en: item.manager?.name?.en,
                ar: item.manager?.name?.ar
            },
            status: item.manager?.status,
            manager_email: item.manager?.manager_email,
            manager_phone: item.manager?.manager_phone,
            national_id: item.manager?.national_id,
            gender: item.manager?.gender,
            nationality_id: item.manager?.nationality?.id,
            city_id: item.manager?.city?.id,
            academic_level_id: item.manager?.academic_level_id,
            specification_id: item.manager?.specification_id,
            date_of_birth: item.manager?.date_of_birth,
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
                title={t('table_titles.entities')}
                refresh={refresh}
                loading={isLoading}
                data={tableData}
                serverPagination={true}
                totalCount={data?.meta?.total}
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
