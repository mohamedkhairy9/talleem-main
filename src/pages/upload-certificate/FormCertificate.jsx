import useRFH from '@/utils/hooks/global/useRFH';
import { certificatesSchema as schema } from '@/utils/yup/certificates.schemas';
import React, { useEffect, useMemo, useState } from 'react';
import { certificatesFields, issuedFromOptions } from './configs';
import InputRFH from '@/components/common/inputs/InputRFH';
import Btn from '@/components/common/buttons/Btn';
import { getNestedError } from '@/utils/helpers/getNestedError';
import { generateOptions, onlyDate } from '@/utils/helpers/global.fns';
import { useStudentsQuery } from '@/api/hooks/useStudents';
import { enabledDisabledOptions } from '@/utils/constants/options';

export default function FormCertificate({
    onClose,
    oldData,
    editMode,
    viewMode,
    isPending,
    mutate,
    options
}) {

    const [certificateImagePreview, setCertificateImagePreview] = useState(
        oldData?.file || null
    );
    const [certificateImageChanged, setCertificateImageChanged] = useState(false);

    const defaultValues = useMemo(() => ({
        ...oldData,
        issued_date: onlyDate(oldData?.issued_date)
    }), [oldData]);

    const { register, errors, handleSubmit, control, setValue, watch } = useRFH({
        schema,
        defaultValues
    });

    // Watch values for filtering
    const mainProgramId = watch('main_program_id');
    const branchId = watch('branch_id');
    const entityId = watch('entity_id');

    // Fetch students dynamically based on program and entity
    const studentsParams = useMemo(() => {
        if (!mainProgramId || !entityId) return null;
        return {
            main_program_id: mainProgramId,
            entity_id: entityId,
            status: 'all'
        };
    }, [mainProgramId, entityId]);

    const { data: studentsData, isLoading: studentsLoading } = useStudentsQuery(
        studentsParams || {},
        {
            enabled: !!studentsParams
        }
    );

    // Filter entities based on branch and main program
    const filteredEntities = useMemo(() => {
        if (!branchId || !mainProgramId || !options.entity_id) return [];
        return options.entity_id.filter(entity => {
            const matchesProgram = entity.main_program?.id === Number(mainProgramId);
            const matchesBranch = entity.branch?.id === Number(branchId);
            return matchesProgram && matchesBranch;
        });
    }, [branchId, mainProgramId, options.entity_id]);

    // Reset dependent fields when main program changes
    useEffect(() => {
        if (mainProgramId && mainProgramId !== oldData?.main_program_id) {
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
        issued_from: issuedFromOptions,
        branch_id: options.branch_id || [],
        entity_id: filteredEntities,
        student_id: studentsData?.data || [],
        is_active: enabledDisabledOptions
    }), [options, filteredEntities, studentsData]);

    function onSubmit(data) {
        // Remove filter-only fields from submission
        const { main_program_id, branch_id, entity_id, ...submissionData } = data;
    
        // Convert is_active to number
        if (typeof submissionData.is_active === 'boolean') {
            submissionData.is_active = submissionData.is_active ? 1 : 0;
        }
    
        // Handle file - make sure it's a single file, not an array
        if (submissionData.file) {
            // If it's a FileList or array, get the first file
            if (submissionData.file instanceof FileList || Array.isArray(submissionData.file)) {
                submissionData.file = submissionData.file[0];
            }
        }
    
        // In edit mode, if certificate image not changed, don't send it
        if (editMode && !certificateImageChanged) {
            delete submissionData.file;
        }
    
        const finalData = editMode 
            ? { ...submissionData, id: oldData.id } 
            : submissionData;
    
        console.log('Submitting certificate data:', finalData);
    
        mutate(finalData, {
            onSuccess: () => {
                onClose();
            }
        });
    }
        
    // Helper function to determine if a field should be disabled
    const isFieldDisabled = (fieldName) => {
        if (viewMode) return true;

        // Entity disabled until branch AND program are selected
        if (fieldName === 'entity_id' && (!branchId || !mainProgramId)) {
            return true;
        }

        // Student disabled until entity is selected OR students are loading
        if (fieldName === 'student_id') {
            return !entityId || studentsLoading;
        }

        return false;
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certificatesFields.map(field => {
                    // Special handling for certificate image with preview
                    if (field.name === 'file') {
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
                                options={generateOptions(enhancedOptions[field.name])}
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