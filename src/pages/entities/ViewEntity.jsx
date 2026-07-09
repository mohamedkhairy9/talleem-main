import React, { useMemo, useState } from 'react';
import FormEntity from './FormEntity';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import Loader from '@/components/common/Loader';
import useApiCalls from './useApiCalls';
import { apiCalls } from './configs';
import {
    enabledDisabledOptions,
    genderOptions
} from '@/utils/constants/options';
import useLocale from '@/utils/hooks/global/useLocale';
import IssueEntityLicense from './IssueEntityLicense';
import UpdateEntityLicenseActivities from './UpdateEntityLicenseActivities';
import { useEntityQuery } from '@/api/hooks/useEntities';
import { onlyDate } from '@/utils/helpers/global.fns';

const statusOptions = [
    { label: { ar: 'نشط', en: 'Active' }, value: 'active' },
    { label: { ar: 'غير نشط', en: 'Inactive' }, value: 'inactive' },
    { label: { ar: 'معلق', en: 'Suspended' }, value: 'suspended' },
    { label: { ar: 'ملغاة', en: 'Canceled' }, value: 'canceled' },
    { label: { ar: 'غير مصرح', en: 'Unauthorized' }, value: 'unauthorized' }
];

const entryTypeOptions = [
    {
        label: { ar: 'جديد بالموافقة', en: 'New with Approval' },
        value: 'new_with_approval'
    },
    {
        label: { ar: 'نشط برخصة', en: 'Active with License' },
        value: 'active_with_license'
    }
];

const normalizeEntityFormData = item => {
    if (!item) return null;

    return {
        id: item.id,
        name: {
            en: item.name?.en,
            ar: item.name?.ar
        },
        status: item.status,
        city_id: item.city?.id,
        neighborhood_id: item.neighborhood?.id,
        branch_id: item.branch?.id,
        main_program_id: item.main_program?.id ?? item.main_program_id,
        session_mode_id: item.session_mode?.id,
        education_program_entity_type_classification: null,
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
        activities: item.activities,
        registration_date: item.registration_date,
        entry_type: item.entry_type,
        license_number: item.license_number,
        license_image: item.license_image,
        license_issue_date: item.license_issue_date,
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
            nationality_id:
                item.manager?.nationality != null
                    ? Number(item.manager.nationality.id)
                    : undefined,
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
    };
};

export default function ViewEntity({ onClose, oldData }) {
    const [isIssueLicenseOpen, setIsIssueLicenseOpen] = useState(false);
    const [issuedInSession, setIssuedInSession] = useState(false);
    const [activeTab, setActiveTab] = useState('details');
    const { currentLocale } = useLocale();

    const { data: entityDetailsResponse, isLoading: isEntityDetailsLoading } =
        useEntityQuery(oldData?.id, {
            enabled: !!oldData?.id
        });

    const detailedEntity = entityDetailsResponse?.data || entityDetailsResponse || null;
    const resolvedEntity = useMemo(
        () => normalizeEntityFormData(detailedEntity) || oldData,
        [detailedEntity, oldData]
    );

    const hasLicenseNumber = !!resolvedEntity?.license_number;
    const canIssueLicense = !hasLicenseNumber && !issuedInSession;

    const {
        branchesData,
        mainProgramsData,
        educationProgramEntityTypesData,
        citiesData,
        neighborhoodsData,
        locationTypesData,
        usersData,
        activitiesData,
        memorizationProgramEntityTypesData,
        nationalitiesData,
        academicLevelsData,
        specificationsData,
        academicQualificationsData,
        sessionModesData,
        isLoading
    } = useApiCalls({
        apiCalls,
        mainProgramId: resolvedEntity?.main_program_id
    });

    if (isLoading || isEntityDetailsLoading || !resolvedEntity) return <Loader />;

    return (
        <>
            <Modal onClose={onClose} size="5xl">
                <ModalHeader onClose={onClose} header="entities.view" />

                <div className="border-b border-gray-200 bg-white px-5 pt-4">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <nav
                            className="-mb-px flex min-w-max gap-6 overflow-x-auto pb-px"
                            aria-label="Tabs"
                        >
                            <button
                                type="button"
                                onClick={() => setActiveTab('details')}
                                className={`border-b-2 px-1 pb-3 text-sm font-semibold transition ${
                                    activeTab === 'details'
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {currentLocale === 'ar'
                                    ? 'بيانات الجهة'
                                    : 'Entity Details'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('activities')}
                                className={`border-b-2 px-1 pb-3 text-sm font-semibold transition ${
                                    activeTab === 'activities'
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {currentLocale === 'ar'
                                    ? 'أنشطة الجهة'
                                    : 'Entity Activities'}
                            </button>
                        </nav>

                        {activeTab === 'details' && canIssueLicense && (
                            <button
                                type="button"
                                onClick={() => setIsIssueLicenseOpen(true)}
                                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                            >
                                {currentLocale === 'ar'
                                    ? 'إصدار رخصة'
                                    : 'Issue License'}
                            </button>
                        )}
                    </div>
                </div>

                {activeTab === 'details' ? (
                    <FormEntity
                        onClose={onClose}
                        oldData={resolvedEntity}
                        viewMode={true}
                        hideActivityField={true}
                        mutate={() => {}}
                        isPending={false}
                        options={{
                            user_id: usersData?.data,
                            branch_id: branchesData?.data,
                            main_program_id: mainProgramsData?.data,
                            education_program_entity_type_id:
                                educationProgramEntityTypesData?.data,
                            city_id: citiesData?.data,
                            neighborhood_id: neighborhoodsData?.data,
                            location_type_id: locationTypesData?.data,
                            status: statusOptions,
                            activity_ids: activitiesData?.data,
                            memorization_program_entity_type_id:
                                memorizationProgramEntityTypesData?.data,
                            nationality_id: nationalitiesData?.data,
                            academic_level_id: academicLevelsData?.data,
                            specification_id: specificationsData?.data,
                            gender: genderOptions,
                            session_mode_id: sessionModesData?.data,
                            entry_type: entryTypeOptions,
                            'manager.city_id': citiesData?.data,
                            'manager.nationality_id': nationalitiesData?.data,
                            'manager.academic_qualification_id':
                                academicQualificationsData?.data,
                            'manager.specification_id': specificationsData?.data,
                            'manager.gender': genderOptions,
                            'manager.status': enabledDisabledOptions
                        }}
                    />
                ) : (
                    <UpdateEntityLicenseActivities
                        entityId={resolvedEntity?.id}
                        oldData={resolvedEntity}
                    />
                )}
            </Modal>

            {isIssueLicenseOpen && (
                <IssueEntityLicense
                    entityId={resolvedEntity?.id}
                    onClose={setIsIssueLicenseOpen}
                    onIssued={() => {
                        setIssuedInSession(true);
                        setActiveTab('activities');
                    }}
                />
            )}
        </>
    );
}
