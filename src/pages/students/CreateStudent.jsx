import React from 'react';
import FormStudent from './FormStudent';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useCreateStudentMutation } from '@/api/hooks/useStudents';
import { studentsDefaultValues } from './configs';
import { useBranchesQuery } from '@/api/hooks/useBranches';
import { useMainProgramsQuery } from '@/api/hooks/useMainPrograms';
import { useEntityCategoriesQuery } from '@/api/hooks/useEntityCategories';
import { useEducationProgramEntityTypesQuery } from '@/api/hooks/useEducationProgramEntityTypes';
import { useCitiesQuery } from '@/api/hooks/useCities';
import { useKinshipsQuery } from '@/api/hooks/useKinships';
import { useAcademicLevelsQuery } from '@/api/hooks/useAcademicLevels';
import { useEntitiesQuery } from '@/api/hooks/useEntities';
import { useNationalitiesQuery } from '@/api/hooks/useNationalities';
import { useMajorsQuery } from '@/api/hooks/useMajors';
import { useSpecificationsQuery } from '@/api/hooks/useSpecifications';
import Loader from '@/components/common/Loader';
import { allData } from '@/utils/constants/global.constants';
import { enabledDisabledOptions } from '@/utils/constants/options';

const genderOptions = [
    { label: { ar: 'ذكر', en: 'Male' }, value: 'male' },
    { label: { ar: 'أنثى', en: 'Female' }, value: 'female' }
];

const yesNoOptions = [
    { label: { ar: 'نعم', en: 'Yes' }, value: 1 },
    { label: { ar: 'لا', en: 'No' }, value: 0 }
];

export default function CreateStudent({ onClose }) {
    const { mutate, isPending } = useCreateStudentMutation();

    // Fetch all available options
    const { data: branchesData, isLoading: branchesLoading } =
        useBranchesQuery(allData);
    const { data: mainProgramsData, isLoading: mainProgramsLoading } =
        useMainProgramsQuery(allData);
    const {
        data: educationProgramEntityTypesData,
        isLoading: educationProgramEntityTypesLoading
    } = useEducationProgramEntityTypesQuery(allData);
    const { data: citiesData, isLoading: citiesLoading } =
        useCitiesQuery(allData);
    const { data: kinshipsData, isLoading: kinshipsLoading } =
        useKinshipsQuery(allData);
    const { data: academicLevelsData, isLoading: academicLevelsLoading } =
        useAcademicLevelsQuery(allData);
    const { data: entitiesData, isLoading: entitiesLoading } =
        useEntitiesQuery(allData);
    const { data: nationalitiesData, isLoading: nationalitiesLoading } =
        useNationalitiesQuery(allData);
    const { data: majorsData, isLoading: majorsLoading } =
        useMajorsQuery(allData);
    const { data: specificationsData, isLoading: specificationsLoading } =
        useSpecificationsQuery(allData);

    const isLoading =
        branchesLoading ||
        mainProgramsLoading ||
        educationProgramEntityTypesLoading ||
        citiesLoading ||
        kinshipsLoading ||
        academicLevelsLoading ||
        entitiesLoading ||
        nationalitiesLoading ||
        majorsLoading ||
        specificationsLoading;

    if (isLoading) return <Loader />;

    return (
        <Modal onClose={onClose} size="5xl">
            <ModalHeader onClose={onClose} header="students.create" />
            <FormStudent
                onClose={onClose}
                oldData={studentsDefaultValues}
                mutate={mutate}
                isPending={isPending}
                options={{
                    branch_id: branchesData?.data,
                    main_program_id: mainProgramsData?.data,
                    // entity_category_id: entityCategoriesData?.data,
                    education_program_entity_type_id:
                        educationProgramEntityTypesData?.data,
                    city_id: citiesData?.data,
                    kinship_id: kinshipsData?.data,
                    academic_level_id: academicLevelsData?.data,
                    entity_id: entitiesData?.data,
                    nationality_id: nationalitiesData?.data,
                    specification_id: specificationsData?.data,
                    major_id: majorsData?.data,
                    status: enabledDisabledOptions,
                    gender: genderOptions,
                    has_medical_issues: yesNoOptions,
                    has_high_school: yesNoOptions,
                    has_bachelors_degree: yesNoOptions,
                    has_memorized_quran_5_parts: yesNoOptions
                }}
            />
        </Modal>
    );
}
