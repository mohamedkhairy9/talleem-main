import React, { useMemo, useState } from 'react';
import FormTeacher from './FormTeacher';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useBranchesQuery } from '@/api/hooks/useBranches';
import { useMainProgramsQuery } from '@/api/hooks/useMainPrograms';
import { useEducationProgramEntityTypesQuery } from '@/api/hooks/useEducationProgramEntityTypes';
import { useAcademicQualificationsQuery } from '@/api/hooks/useAcademicQualifications';
import { useSpecificationsQuery } from '@/api/hooks/useSpecifications';
import { useCitiesQuery } from '@/api/hooks/useCities';
import { useNationalitiesQuery } from '@/api/hooks/useNationalities';
import { useUsersQuery } from '@/api/hooks/useUsers';
import Loader from '@/components/common/Loader';
import { allData } from '@/utils/constants/global.constants';
import { genderOptions } from '@/utils/constants/options';
import { teacherReadonlyStatusOptions } from './teacherStatusOptions';

const entryTypeOptions = [
    { label: { ar: 'جديد بالموافقة', en: 'New with Approval' }, value: 'new_with_approval' },
    { label: { ar: 'نشط برخصة', en: 'Active with License' }, value: 'active_with_license' }
];
import { useEntitiesQuery } from '@/api/hooks/useEntities';
import { useMemorizationProgramEntityTypesQuery } from '@/api/hooks/useMemorizationProgramEntityTypes';
import { useMajorsQuery } from '@/api/hooks/useMajors';
import useLocale from '@/utils/hooks/global/useLocale';
import IssueTeacherLicense from './IssueTeacherLicense';
import { useTeacherQuery } from '@/api/hooks/useTeachers';
import { getTeacherLicenseFormData } from './teacherLicenseDetails';

export default function ViewTeacher({ onClose, oldData }) {
    const [isIssueLicenseOpen, setIsIssueLicenseOpen] = useState(false);
    const [issuedInSession, setIssuedInSession] = useState(false);
    const { currentLocale } = useLocale();
    const { data: teacherDetailsResponse, isLoading: teacherDetailsLoading } =
        useTeacherQuery(oldData?.id, {
            enabled: !!oldData?.id
        });

    const detailedTeacher =
        teacherDetailsResponse?.data || teacherDetailsResponse || null;
    const resolvedTeacher = useMemo(() => {
        const teacher = detailedTeacher || oldData;
        const entities = Array.isArray(teacher?.entities) && teacher.entities.length > 0
            ? teacher.entities
            : oldData?.entities || (oldData?.entity ? [oldData.entity] : []);

        return {
            ...oldData,
            ...teacher,
            branch_id: teacher?.branch?.id ?? teacher?.branch_id ?? oldData?.branch_id,
            city_id: teacher?.city?.id ?? teacher?.city_id ?? oldData?.city_id,
            main_program_id:
                teacher?.main_program?.id ??
                teacher?.main_program_id ??
                oldData?.main_program_id,
            entity_ids: entities
                .map(entity => entity?.id ?? entity?.value ?? entity)
                .filter(entity => entity !== null && entity !== undefined && entity !== ''),
            entities,
            status: String(teacher?.status ?? oldData?.status ?? '').toLowerCase(),
            ...getTeacherLicenseFormData(teacher, oldData)
        };
    }, [detailedTeacher, oldData]);

    const normalizedStatus = String(resolvedTeacher?.status ?? '').toLowerCase();
    const canIssueLicense =
        !issuedInSession &&
        normalizedStatus !== 'active' &&
        !resolvedTeacher?.license_number;

    // Fetch all available options
    const { data: branchesData, isLoading: branchesLoading } =
        useBranchesQuery(allData);

    const { data: entitiesData, isLoading: entitiesLoading } =
        useEntitiesQuery(allData);
    const { data: mainProgramsData, isLoading: mainProgramsLoading } =
        useMainProgramsQuery(allData);
    const {
        data: educationProgramEntityTypesData,
        isLoading: educationProgramEntityTypesLoading
    } = useEducationProgramEntityTypesQuery(allData);
    const {
        data: memorizationProgramEntityTypesData,
        isLoading: memorizationProgramEntityTypesLoading
    } = useMemorizationProgramEntityTypesQuery(allData);
    const {
        data: academicQualificationsData,
        isLoading: academicQualificationsLoading
    } = useAcademicQualificationsQuery(allData);
    const { data: specificationsData, isLoading: specificationsLoading } =
        useSpecificationsQuery(allData);
    const { data: citiesData, isLoading: citiesLoading } =
        useCitiesQuery(allData);
    const { data: nationalitiesData, isLoading: nationalitiesLoading } =
        useNationalitiesQuery(allData);
    const { data: usersData, isLoading: usersLoading } = useUsersQuery(allData);
    const { data: majorsData, isLoading: majorsLoading } =
        useMajorsQuery(allData);

    const isLoading =
        branchesLoading ||
        mainProgramsLoading ||
        educationProgramEntityTypesLoading ||
        academicQualificationsLoading ||
        specificationsLoading ||
        citiesLoading ||
        nationalitiesLoading ||
        usersLoading ||
        majorsLoading ||
        entitiesLoading ||
        memorizationProgramEntityTypesLoading ||
        teacherDetailsLoading;

    if (isLoading) return <Loader />;

    return (
        <>
        <Modal onClose={onClose} size="5xl">
            <ModalHeader onClose={onClose} header="teachers.view" />
            {canIssueLicense && (
                <div className="flex justify-end border-b border-gray-200 bg-gray-50 px-5 py-3">
                    <button
                        type="button"
                        onClick={() => setIsIssueLicenseOpen(true)}
                        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                    >
                        {currentLocale === 'ar' ? 'إصدار رخصة' : 'Issue License'}
                    </button>
                </div>
            )}
            <FormTeacher
                onClose={onClose}
                oldData={resolvedTeacher}
                viewMode={true}
                mutate={() => {}}
                isPending={false}
                options={{
                    user_id: usersData?.data,
                    nationality_id: nationalitiesData?.data,
                    branch_id: branchesData?.data,
                    main_program_id: mainProgramsData?.data,
                    entity_id: entitiesData?.data,
                    major_id: majorsData?.data,
                    education_program_entity_type_id:
                        educationProgramEntityTypesData?.data,
                    memorization_program_entity_type_id:
                        memorizationProgramEntityTypesData?.data,
                    academic_qualification_id: academicQualificationsData?.data,
                    specification_id: specificationsData?.data,
                    city_id: citiesData?.data,
                    status: teacherReadonlyStatusOptions,
                    gender: genderOptions,
                    entry_type: entryTypeOptions
                }}
            />
        </Modal>
        {isIssueLicenseOpen && (
            <IssueTeacherLicense
                teacherId={resolvedTeacher?.id}
                onClose={setIsIssueLicenseOpen}
                onIssued={() => setIssuedInSession(true)}
            />
        )}
        </>
    );
}
