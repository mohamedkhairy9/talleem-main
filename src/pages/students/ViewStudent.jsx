import React from 'react';
import FormStudent from './FormStudent';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import { useBranchesQuery } from '@/api/hooks/useBranches';
import { useMainProgramsQuery } from '@/api/hooks/useMainPrograms';
import { useEntityCategoriesQuery } from '@/api/hooks/useEntityCategories';
import { useEducationProgramEntityTypesQuery } from '@/api/hooks/useEducationProgramEntityTypes';
import { useCitiesQuery } from '@/api/hooks/useCities';
import { useKinshipsQuery } from '@/api/hooks/useKinships';
import { useAcademicLevelsQuery } from '@/api/hooks/useAcademicLevels';
import { useEntitiesQuery } from '@/api/hooks/useEntities';
import { useNationalitiesQuery } from '@/api/hooks/useNationalities';
import { useSpecificationsQuery } from '@/api/hooks/useSpecifications';
import { useAcademicQualificationsQuery } from '@/api/hooks/useAcademicQualifications';
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

export default function ViewStudent({ onClose, oldData }) {
    // Fetch all available options
    const { data: branchesData, isLoading: branchesLoading } =
        useBranchesQuery(allData);
    const { data: mainProgramsData, isLoading: mainProgramsLoading } =
        useMainProgramsQuery(allData);
    const { data: entityCategoriesData, isLoading: entityCategoriesLoading } =
        useEntityCategoriesQuery(allData);
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
    const { data: specificationsData, isLoading: specificationsLoading } =
        useSpecificationsQuery(allData);
    const { data: academicQualificationsData, isLoading: academicQualificationsLoading } =
        useAcademicQualificationsQuery(allData);

    const isLoading =
        branchesLoading ||
        mainProgramsLoading ||
        entityCategoriesLoading ||
        educationProgramEntityTypesLoading ||
        citiesLoading ||
        kinshipsLoading ||
        academicLevelsLoading ||
        entitiesLoading ||
        nationalitiesLoading ||
        specificationsLoading ||
        academicQualificationsLoading;

    if (isLoading) return <Loader />;

    return (
        <Modal onClose={onClose} size="5xl">
            <ModalHeader onClose={onClose} header="students.view" />
            <FormStudent
                onClose={onClose}
                oldData={oldData}
                viewMode={true}
                mutate={() => {}}
                isPending={false}
                options={{
                    branch_id: branchesData?.data,
                    main_program_id: mainProgramsData?.data,
                    // entity_category_id: entityCategoriesData?.data,
                    education_program_entity_type_id:
                        educationProgramEntityTypesData?.data,
                    city_id: citiesData?.data,
                    kinship_id: kinshipsData?.data,
                    academic_level_id: academicLevelsData?.data,
                    academic_qualification_id: academicQualificationsData?.data,
                    entity_id: entitiesData?.data,
                    nationality_id: nationalitiesData?.data,
                    specification_id: specificationsData?.data,
                    status: enabledDisabledOptions.map(field => ({
                        ...field,
                        value: field.value ? 1 : 0
                    })),
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
