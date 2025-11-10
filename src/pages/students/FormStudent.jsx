import useRFH from '@/utils/hooks/global/useRFH';
import { studentsSchema as schema } from '@/utils/yup/students.schemas';
import React, { useEffect, useMemo, useRef } from 'react';
import { studentsFields } from './configs';
import InputRFH from '@/components/common/inputs/InputRFH';
import FileInputRFH from '@/components/common/inputs/FileInputRFH';
import Btn from '@/components/common/buttons/Btn';
import { getNestedError } from '@/utils/helpers/getNestedError';
import {
    generateOptions,
    getUniqueOptionsByName,
    generateOptionsWithCustomLabel
} from '@/utils/helpers/global.fns';
import { onlyDate } from '@/utils/helpers/global.fns';
import useLocale from '@/utils/hooks/global/useLocale';
import i18next from 'i18next';

export default function FormStudent({
    onClose,
    oldData,
    editMode,
    viewMode,
    isPending,
    mutate,
    options
}) {
    const { t } = useLocale();
    const { register, errors, handleSubmit, setValue, control, watch } = useRFH(
        {
            schema,
            defaultValues: {
                ...oldData,
                date_of_birth: onlyDate(oldData?.date_of_birth),
                registration_date: onlyDate(oldData?.registration_date),
                qualification: oldData?.qualification || {
                    has_high_school: 0,
                    high_school_grade: 0,
                    has_bachelors_degree: 0,
                    major_id: null,
                    has_memorized_quran_5_parts: 0,
                    memorized_quran_parts: 0
                },
                department: oldData?.department || { en: '', ar: '' }
            }
        }
    );

    console.log("Entities", options.entity_id)

    const mainProgramId = watch('main_program_id');
    const hasMedicalIssues = watch('has_medical_issues');
    const hasHighSchool = watch('qualification.has_high_school');
    const hasBachelors = watch('qualification.has_bachelors_degree');
    const hasMemorizedFive = watch('qualification.has_memorized_quran_5_parts');
    const educationClassification = watch(
        'education_program_entity_type_classification'
    );
    const entityCategory = watch('entity_category_id');
    const city = watch('city_id');
    
    console.log("entity category: ", entityCategory)

    // Filter the entities options based on the entity category (for mainProgramId === 1)
    const filteredEntities = useMemo(() => {
        if(!mainProgramId) return []; // if no education program was selected
        const entities = options.entity_id;
        if(Number(mainProgramId) === 2){ // For memorization program
            return entities.filter(entity => {
                return entity.main_program.id === mainProgramId   
            })
        }else if(Number(mainProgramId) === 1){ // For education program
            if(!entityCategory) return []; // if no entity category was selected
            
            return entities
                .filter(entity => {
                    return entity.main_program.id === mainProgramId   
                })
                .filter(entity => { 
                    // filter based on entity category
                    return entity.education_program_entity_type?.id === entityCategory
                })            
        }
    }, [mainProgramId, entityCategory, options.entity_id])    

    // Filter branches based on the selected city
    const filteredBranches = useMemo(() => {
        if(!city) return []; // if no city is selected
        const branches = options.branch_id;
        console.log("Branches: ", branches)
        return branches.filter(branch => branch.city.id === city);
    })

    // console.log(filteredBranches)

    // Get unique options by name for education program entity types (for mainProgramId === 1)
    const uniqueEducationClassifications = useMemo(
        () =>
            getUniqueOptionsByName(
                options.education_program_entity_type_id || []
            ),
        [options.education_program_entity_type_id]
    );

    // Filter entity categories based on selected classification (for mainProgramId === 1)
    const filteredEntityCategories = useMemo(() => {
        if (Number(mainProgramId) !== 1 || !educationClassification) return [];
        const lang = i18next.language;
        const selectedClassification = uniqueEducationClassifications.find(
            u =>
                u.id === educationClassification ||
                u.value === educationClassification
        );
        if (!selectedClassification) return [];
        const selectedName =
            selectedClassification.name?.[lang] ||
            selectedClassification.name?.en ||
            selectedClassification.name?.ar ||
            selectedClassification.name;
        return (options.education_program_entity_type_id || []).filter(opt => {
            const optName =
                opt.name?.[lang] || opt.name?.en || opt.name?.ar || opt.name;
            return optName === selectedName;
        });
    }, [
        mainProgramId,
        educationClassification,
        uniqueEducationClassifications,
        options.education_program_entity_type_id
    ]);

    // Reset fields when main_program_id changes
    useEffect(() => {
        if (
            (mainProgramId && mainProgramId != oldData?.main_program_id) ||
            !oldData?.main_program_id
        ) {
            setValue('education_program_entity_type_classification', '');
            setValue('entity_category_id', '');
        }
    }, [mainProgramId, oldData?.main_program_id, setValue]);

    // Reset entity_category_id when classification changes
    const initializingClassificationRef = useRef(false);
    useEffect(() => {
        if (Number(mainProgramId) === 1) {
            const isInitializing = initializingClassificationRef.current;
            if (
                (educationClassification &&
                    educationClassification !=
                        oldData?.education_program_entity_type_classification) ||
                (!oldData?.education_program_entity_type_classification &&
                    !isInitializing)
            ) {
                setValue('entity_category_id', '');
            }
        }
    }, [
        educationClassification,
        mainProgramId,
        oldData?.education_program_entity_type_classification,
        setValue
    ]);

    // Set the classification value when editing (based on entity_category_id's name)
    const initializedClassificationRef = useRef(false);
    useEffect(() => {
        if (initializedClassificationRef.current) return;
        if (
            Number(mainProgramId) === 1 &&
            oldData?.entity_category_id &&
            !oldData?.education_program_entity_type_classification
        ) {
            const selectedEntityType = (
                options.education_program_entity_type_id || []
            ).find(opt => opt.id === oldData.entity_category_id);
            if (!selectedEntityType) return;
            const lang = i18next.language;
            const selectedName =
                selectedEntityType.name?.[lang] ||
                selectedEntityType.name?.en ||
                selectedEntityType.name?.ar ||
                selectedEntityType.name;
            const matchingUniqueClassification =
                uniqueEducationClassifications.find(u => {
                    const uName =
                        u.name?.[lang] || u.name?.en || u.name?.ar || u.name;
                    return uName === selectedName;
                });
            if (matchingUniqueClassification) {
                setValue(
                    'education_program_entity_type_classification',
                    matchingUniqueClassification.id ||
                        matchingUniqueClassification.value,
                    { shouldDirty: false, shouldValidate: false }
                );
                initializedClassificationRef.current = true;
                initializingClassificationRef.current = true;
            }
        }
    }, [
        mainProgramId,
        oldData,
        uniqueEducationClassifications,
        options.education_program_entity_type_id,
        setValue
    ]);

    // After classification has been initialized in edit mode, set entity_category_id from oldData
    useEffect(() => {
        if (
            Number(mainProgramId) === 1 &&
            initializedClassificationRef.current &&
            oldData?.entity_category_id
        ) {
            setValue('entity_category_id', oldData.entity_category_id, {
                shouldDirty: false,
                shouldValidate: false
            });
            initializingClassificationRef.current = false;
        }
    }, [mainProgramId, setValue, oldData?.entity_category_id]);

    const enhancedOptions = {
        ...options,
        education_program_entity_type_classification:
            Number(mainProgramId) === 1 ? uniqueEducationClassifications : [],
        entity_category_id:
            Number(mainProgramId) === 1
                ? educationClassification
                    ? generateOptionsWithCustomLabel(
                          filteredEntityCategories,
                          'educational_entity_classification'
                      )
                    : []
                : [],
        entity_id: filteredEntities,
        branch_id: filteredBranches
    };

    function onSubmit(data) {
        // Remove the helper field from submission
        const {
            education_program_entity_type_classification: _classificationHelper,
            ...submitData
        } = data;

        mutate(
            {
                ...submitData,
                status: submitData.status ? 1 : 0,
                ...(submitData.main_program_id == 1
                    ? {
                          education_program_entity_type_id:
                              submitData.entity_category_id
                      }
                    : {})
            },
            {
                onSuccess: () => {
                    onClose();
                }
            }
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {studentsFields
                    .filter(field => {
                        // Check edit/view mode
                        const modeMatch =
                            (editMode && field.editMode) ||
                            (viewMode && field.viewMode) ||
                            (!editMode && !viewMode);

                        if (!modeMatch) return false;

                        // Check conditional fields
                        if (field.conditional && field.showWhen) {
                            const condition = field.showWhen.main_program_id;
                            if (Array.isArray(condition)) {
                                return condition.includes(
                                    Number(mainProgramId)
                                );
                            } else {
                                return Number(mainProgramId) === condition;
                            }
                        }

                        return true;
                    })
                    .map(field => {
                        // Conditionally show issue_description only if has_medical_issues is 1
                        if (
                            field.name === 'issue_description' &&
                            hasMedicalIssues !== 1
                        ) {
                            return null;
                        }

                        return (
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
                                {field.type === 'file' &&
                                field.name !== 'profile_picture' ? (
                                    <FileInputRFH
                                        register={register}
                                        control={control}
                                        error={getNestedError(
                                            errors,
                                            field.name
                                        )}
                                        placeholder={field.placeholder}
                                        disabled={viewMode}
                                        label={field.label}
                                        name={field.name}
                                        multiple={field.multiple}
                                        defaultValue={oldData?.files || []}
                                        setValue={setValue}
                                    />
                                ) : (
                                    <InputRFH
                                        p="px-3 py-3"
                                        control={control}
                                        register={register}
                                        error={getNestedError(
                                            errors,
                                            field.name
                                        )}
                                        type={field.type}
                                        placeholder={field.placeholder}
                                        disabled={viewMode}
                                        label={field.label}
                                        name={field.name}
                                        info={field.info}
                                        options={
                                            field.name ===
                                                'entity_category_id' &&
                                            Number(mainProgramId) === 1
                                                ? enhancedOptions?.[field.name]
                                                : generateOptions(
                                                      enhancedOptions?.[
                                                          field.name
                                                      ] || options?.[field.name]
                                                  )
                                        }
                                        defaultValue={
                                            oldData?.[field.name] ||
                                            field.defaultValue
                                        }
                                    />
                                )}
                            </div>
                        );
                    })}
            </div>

            {/* Qualification Section - Only show when main_program_id === 1 */}
            {Number(mainProgramId) === 1 && (
                <div className="mt-6 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                        {t('students.qualification')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border border-gray-200 rounded-lg ">
                        <InputRFH
                            p="px-3 py-3"
                            control={control}
                            register={register}
                            error={getNestedError(
                                errors,
                                'qualification.has_high_school'
                            )}
                            type="select"
                            placeholder="validation.qualification.has_high_school.placeholder"
                            disabled={viewMode}
                            label="validation.qualification.has_high_school.label"
                            name="qualification.has_high_school"
                            options={generateOptions(options?.has_high_school)}
                            defaultValue={
                                oldData?.qualification?.has_high_school ?? 0
                            }
                        />
                        {Number(hasHighSchool) === 1 && (
                            <InputRFH
                                p="px-3 py-3"
                                control={control}
                                register={register}
                                error={getNestedError(
                                    errors,
                                    'qualification.high_school_grade'
                                )}
                                type="number"
                                placeholder="validation.qualification.high_school_grade.placeholder"
                                disabled={viewMode}
                                label="validation.qualification.high_school_grade.label"
                                name="qualification.high_school_grade"
                                defaultValue={
                                    oldData?.qualification?.high_school_grade ??
                                    0
                                }
                            />
                        )}
                        <InputRFH
                            p="px-3 py-3"
                            control={control}
                            register={register}
                            error={getNestedError(
                                errors,
                                'qualification.has_bachelors_degree'
                            )}
                            type="select"
                            placeholder="validation.qualification.has_bachelors_degree.placeholder"
                            disabled={viewMode}
                            label="validation.qualification.has_bachelors_degree.label"
                            name="qualification.has_bachelors_degree"
                            options={generateOptions(
                                options?.has_bachelors_degree
                            )}
                            defaultValue={
                                oldData?.qualification?.has_bachelors_degree ??
                                0
                            }
                        />
                        {Number(hasBachelors) === 1 && (
                            <InputRFH
                                p="px-3 py-3"
                                control={control}
                                register={register}
                                error={getNestedError(
                                    errors,
                                    'qualification.major_id'
                                )}
                                type="select"
                                placeholder="validation.major_id.placeholder"
                                disabled={viewMode}
                                label="validation.major_id.label"
                                name="qualification.major_id"
                                options={generateOptions(options?.major_id)}
                                defaultValue={
                                    oldData?.qualification?.major_id || ''
                                }
                            />
                        )}
                        <InputRFH
                            p="px-3 py-3"
                            control={control}
                            register={register}
                            error={getNestedError(
                                errors,
                                'qualification.has_memorized_quran_5_parts'
                            )}
                            type="select"
                            placeholder="validation.qualification.has_memorized_quran_5_parts.placeholder"
                            disabled={viewMode}
                            label="validation.qualification.has_memorized_quran_5_parts.label"
                            name="qualification.has_memorized_quran_5_parts"
                            options={generateOptions(
                                options?.has_memorized_quran_5_parts
                            )}
                            defaultValue={
                                oldData?.qualification
                                    ?.has_memorized_quran_5_parts ?? 0
                            }
                        />
                        {Number(hasMemorizedFive) === 0 && (
                            <InputRFH
                                p="px-3 py-3"
                                control={control}
                                register={register}
                                error={getNestedError(
                                    errors,
                                    'qualification.memorized_quran_parts'
                                )}
                                type="number"
                                placeholder="validation.qualification.memorized_quran_parts.placeholder"
                                disabled={viewMode}
                                label="validation.qualification.memorized_quran_parts.label"
                                name="qualification.memorized_quran_parts"
                                defaultValue={
                                    oldData?.qualification
                                        ?.memorized_quran_parts ?? 0
                                }
                            />
                        )}
                    </div>
                </div>
            )}

            {!viewMode && (
                <Btn
                    loading={isPending}
                    className="py-[10px] w-full"
                    type="submit"
                    label="common.submit"
                />
            )}
        </form>
    );
}
