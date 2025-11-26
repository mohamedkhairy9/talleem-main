import useRFH from '@/utils/hooks/global/useRFH';
import { certificatesSchema as schema } from '@/utils/yup/certificates.schemas';
import React, { useEffect, useMemo, useState } from 'react';
import { certificatesFields } from './configs';
import InputRFH from '@/components/common/inputs/InputRFH';
import Btn from '@/components/common/buttons/Btn';
import { getNestedError } from '@/utils/helpers/getNestedError';
import { generateOptions, onlyDate } from '@/utils/helpers/global.fns';
import useLocale from '@/utils/hooks/global/useLocale';
import i18next from 'i18next';

export default function FormCertificate({
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

    const [certificateImagePreview, setCertificateImagePreview] = useState(
        oldData?.certificate_image || null
    );
    const [certificateImageChanged, setCertificateImageChanged] = useState(false);

    const defaultValues = useMemo(() => ({
        ...oldData,
        obtained_date: onlyDate(oldData?.obtained_date)
    }), [oldData]);

    const { register, errors, handleSubmit, control, setValue, watch } = useRFH({
        schema,
        defaultValues
    });

    // Watch values for filtering
    const mainProgramId = watch('main_program_id');
    const branchId = watch('branch_id');
    const entityId = watch('entity_id');

    // Filter branches based on main program
    const filteredBranches = useMemo(() => {
        if (!mainProgramId || !options.branch_id) return [];
        return options.branch_id.filter(
            branch => branch.main_program?.id === Number(mainProgramId)
        );
    }, [mainProgramId, options.branch_id]);

    // Filter entities based on branch and main program
    const filteredEntities = useMemo(() => {
        if (!branchId || !mainProgramId || !options.entity_id) return [];
        return options.entity_id.filter(entity => {
            const matchesProgram = entity.main_program?.id === Number(mainProgramId);
            const matchesBranch = entity.branch?.id === Number(branchId);
            return matchesProgram && matchesBranch;
        });
    }, [branchId, mainProgramId, options.entity_id]);

    // Filter students based on branch and entity
    const filteredStudents = useMemo(() => {
        if (!branchId || !entityId || !options.student_id) return [];
        return options.student_id.filter(student => {
            const matchesBranch = student.branch?.id === Number(branchId);
            const matchesEntity = student.entity?.id === Number(entityId);
            return matchesBranch && matchesEntity;
        });
    }, [branchId, entityId, options.student_id]);

    // Reset dependent fields when main program changes
    useEffect(() => {
        if (mainProgramId && mainProgramId !== oldData?.main_program_id) {
            setValue('branch_id', '');
            setValue('entity_id', '');
            setValue('student_id', '');
        }
    }, [mainProgramId, oldData?.main_program_id, setValue]);

    // Reset dependent fields when branch changes
    useEffect(() => {
        if (branchId && branchId !== oldData?.branch_id) {
            setValue('entity_id', '');
            setValue('student_id', '');
        }
    }, [branchId, oldData?.branch_id, setValue]);

    // Reset student when entity changes
    useEffect(() => {
        if (entityId && entityId !== oldData?.entity_id) {
            setValue('student_id', '');
        }
    }, [entityId, oldData?.entity_id, setValue]);

    const enhancedOptions = useMemo(() => ({
        ...options,
        branch_id: filteredBranches,
        entity_id: filteredEntities,
        student_id: filteredStudents
    }), [options, filteredBranches, filteredEntities, filteredStudents]);

    function onSubmit(data) {
        // In edit mode, if certificate image not changed, don't send it
        if (editMode && !certificateImageChanged) {
            delete data.certificate_image;
        }

        const submissionData = editMode ? { ...data, id: oldData.id } : data;

        mutate(submissionData, {
            onSuccess: () => {
                onClose();
            }
        });
    }

    // Helper function to determine if a field should be disabled
    const isFieldDisabled = (fieldName) => {
        if (viewMode) return true;

        // Branch disabled until program is selected
        if (fieldName === 'branch_id' && !mainProgramId) {
            return true;
        }

        // Entity disabled until branch is selected
        if (fieldName === 'entity_id' && !branchId) {
            return true;
        }

        // Student disabled until entity is selected
        if (fieldName === 'student_id' && !entityId) {
            return true;
        }

        return false;
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certificatesFields.map(field => {
                    // Special handling for certificate image with preview
                    if (field.name === 'certificate_image') {
                        return (
                            <div key={field.name} className="md:col-span-2 space-y-2">
                                <InputRFH
                                    p="px-3 py-3"
                                    control={control}
                                    register={register}
                                    error={getNestedError(errors, field.name)}
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    disabled={viewMode}
                                    label={field.label}
                                    name={field.name}
                                    accept={field.accept}
                                    onChange={e => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setCertificateImageChanged(true);
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                setCertificateImagePreview(reader.result);
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                />
                                {certificateImagePreview && (
                                    <div className="mt-2">
                                        <img
                                            src={certificateImagePreview}
                                            alt="Certificate Preview"
                                            className="w-full max-w-md h-auto object-contain border-2 border-gray-300 rounded-lg"
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    }

                    return (
                        <div key={field.name}>
                            <InputRFH
                                p="px-3 py-3"
                                control={control}
                                register={register}
                                error={getNestedError(errors, field.name)}
                                type={field.type}
                                placeholder={field.placeholder}
                                disabled={isFieldDisabled(field.name)}
                                label={field.label}
                                name={field.name}
                                options={
                                    field.options || 
                                    generateOptions(enhancedOptions[field.name] || options[field.name])
                                }
                                defaultValue={defaultValues[field.name] || field.defaultValue}
                                max={field.max}
                            />
                        </div>
                    );
                })}
            </div>
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