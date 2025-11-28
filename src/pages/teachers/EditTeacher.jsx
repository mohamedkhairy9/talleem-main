import React from 'react';
import FormTeacher from './FormTeacher';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useUpdateTeacherMutation } from '@/api/hooks/useTeachers';
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
import { genderOptions, teacherStatusOptions } from '@/utils/constants/options';
import { useMajorsQuery } from '@/api/hooks/useMajors';
import { useEntitiesQuery } from '@/api/hooks/useEntities';
import { useMemorizationProgramEntityTypesQuery } from '@/api/hooks/useMemorizationProgramEntityTypes';

export default function EditTeacher({ onClose, oldData }) {
    console.log('oldData', oldData);
    const { mutate, isPending } = useUpdateTeacherMutation();

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
    const { data: majorsData, isLoading: majorsLoading } = useMajorsQuery(allData);

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
        memorizationProgramEntityTypesLoading;

    if (isLoading) return <Loader />;

    return (
        <Modal onClose={onClose} size="5xl">
            <ModalHeader onClose={onClose} header="teachers.edit" />
            <FormTeacher
                onClose={onClose}
                oldData={{ ...oldData, status: oldData.status?.toLowerCase() }}
                editMode={true}
                mutate={mutate}
                isPending={isPending}
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
                    status: teacherStatusOptions,
                    gender: genderOptions
                }}
            />
        </Modal>
    );
}
