import useRFH from '@/utils/hooks/global/useRFH';
import { certificatesSchema as schema } from '@/utils/yup/certificates.schemas';
import React, { useEffect, useMemo, useState } from 'react';
import { certificatesFields } from './configs';
import InputRFH from '@/components/common/inputs/InputRFH';
import Btn from '@/components/common/buttons/Btn';
import { getNestedError } from '@/utils/helpers/getNestedError';
import { generateOptions, onlyDate } from '@/utils/helpers/global.fns';
import ModalContent from '@/components/common/form/ModalContent';
import ModalFooter from '@/components/common/form/ModalFooter';
import { isFieldRequired } from '@/utils/helpers/schemaHelpers';

export default function FormCertificate({
    onClose,
    oldData,
    editMode,
    viewMode,
    isPending,
    mutate,
    options = {},
    assignedBranchId,
    issuedFrom,
    allowAllCertificateNames = false
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

    useEffect(() => {
        if (assignedBranchId && !editMode && !viewMode) {
            setValue('branch_id', assignedBranchId);
        }
    }, [assignedBranchId, editMode, setValue, viewMode]);

    const mainProgramId = watch('main_program_id');
    const branchId = watch('branch_id');
    const entityId = watch('entity_id');

    // Params for async paginated searchable selects – only include defined values so API receives real filters
    const fieldParams = useMemo(() => {
        const branch = branchId ?? oldData?.branch_id;
        const program = mainProgramId ?? oldData?.main_program_id;
        const entity = entityId ?? oldData?.entity_id;
        return {
            entity_id: {
                ...(branch ? { branch_id: branch } : {}),
                ...(program ? { main_program_id: program } : {})
            },
            student_id: {
                ...(entity ? { entity_id: entity } : {}),
                ...(program ? { main_program_id: program } : {}),
                status: true
            },
            // The issuing source is determined by the logged-in user's form context.
            // Certificate types must never be mixed across entity, branch, and main administration.
            certificate_name_id: issuedFrom
                ? { issued_from: issuedFrom, status: true }
                : {}
        };
    }, [branchId, mainProgramId, entityId, issuedFrom, oldData?.branch_id, oldData?.main_program_id, oldData?.entity_id]);

    // Reset dependents when program or branch changes
    useEffect(() => {
        if (mainProgramId && mainProgramId !== oldData?.main_program_id && !editMode && !viewMode) {
            setValue('entity_id', '');
            setValue('student_id', '');
        }
    }, [mainProgramId, oldData?.main_program_id, setValue, editMode, viewMode]);

    useEffect(() => {
        if (branchId && branchId !== oldData?.branch_id && !editMode && !viewMode) {
            setValue('entity_id', '');
            setValue('student_id', '');
        }
    }, [branchId, oldData?.branch_id, setValue, editMode, viewMode]);

    useEffect(() => {
        if (entityId && entityId !== oldData?.entity_id && !editMode && !viewMode) {
            setValue('student_id', '');
        }
    }, [entityId, oldData?.entity_id, setValue, editMode, viewMode]);

    const enhancedOptions = useMemo(() => {
        // View mode must use the exact options built from the details endpoint.
        // This avoids a blank disabled select when the selected record is not in
        // the first page of a paginated lookup response.
        if (viewMode) {
            return {
                ...options,
                branch_id: options.branch_id || [],
                entity_id: options.entity_id || [],
                student_id: options.student_id || [],
                certificate_name_id: options.certificate_name_id || []
            };
        }

        return {
            ...options,
            branch_id: options.branch_id || [],
            // Empty when deps not met so we never call API without filters; async uses fieldParams when deps met
            entity_id: branchId && mainProgramId ? undefined : [],
            student_id: mainProgramId && entityId ? undefined : [],
            certificate_name_id: issuedFrom || allowAllCertificateNames ? undefined : []
        };
    }, [options, branchId, mainProgramId, entityId, issuedFrom, allowAllCertificateNames, viewMode]);

    const viewCertificateNameOptions = useMemo(() => {
        const certificateName = oldData?.certificate_name;
        const certificateNameId = oldData?.certificate_name_id;

        if (!viewMode || !certificateNameId || !certificateName) return [];

        const label =
            (typeof certificateName === 'object'
                ? certificateName?.ar || certificateName?.en || certificateName?.name
                : certificateName) || '';

        return label
            ? [{ id: certificateNameId, value: certificateNameId, label }]
            : [];
    }, [oldData?.certificate_name, oldData?.certificate_name_id, viewMode]);

    function onSubmit(data) {
        // Remove filter-only fields from submission
        const {
            main_program_id: _mainProgramId,
            branch_id: _branchId,
            entity_id: _entityId,
            ...submissionData
        } = data;

        // Multipart form data serializes booleans as "true" / "false", while
        // Laravel's boolean validator accepts the string forms "1" and "0".
        const isActive = data.is_active ?? oldData?.is_active ?? true;
        submissionData.is_active =
            isActive === false || isActive === 0 || isActive === '0' || isActive === 'false'
                ? 0
                : 1;

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

        if (fieldName === 'branch_id' && assignedBranchId) return true;

        // Entity disabled until branch AND program are selected
        if (fieldName === 'entity_id' && (!branchId || !mainProgramId)) {
            return true;
        }

        // Student disabled until program and entity are selected
        if (fieldName === 'student_id') {
            return !mainProgramId || !entityId;
        }

        return false;
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
            <ModalContent>
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
                                    required={isFieldRequired(schema, field.name)}
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

                    // branch_id, main_program_id: always static. entity_id / student_id: static (empty) until deps met, then async paginated+search
                    const useStaticOptionsOnly =
                        viewMode ||
                        ['branch_id', 'main_program_id'].includes(field.name) ||
                        (field.name === 'entity_id' && (!branchId || !mainProgramId)) ||
                        (field.name === 'student_id' && (!mainProgramId || !entityId)) ||
                        (field.name === 'certificate_name_id' && viewMode) ||
                        (field.name === 'certificate_name_id' && !issuedFrom && !allowAllCertificateNames);

                    // Remount when deps change so async select gets fresh loadOptions with correct filters
                    const fieldKey =
                        field.name === 'entity_id' ? `entity_id-${branchId ?? ''}-${mainProgramId ?? ''}` :
                        field.name === 'student_id' ? `student_id-${mainProgramId ?? ''}-${entityId ?? ''}` :
                        field.name;

                    return (
                        <div key={fieldKey}>
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
                                    field.name === 'certificate_name_id' && viewMode
                                        ? viewCertificateNameOptions
                                        : generateOptions(enhancedOptions[field.name])
                                }
                                isAsync={useStaticOptionsOnly ? false : undefined}
                                defaultValue={defaultValues[field.name] || field.defaultValue}
                                max={field.max}
                                required={isFieldRequired(schema, field.name)}
                                oldData={oldData}
                                fieldParams={fieldParams}
                            />
                        </div>
                    );
                })}
            </div>
            </ModalContent>
            {!viewMode && (
                <ModalFooter>
                    <Btn
                        loading={isPending}
                        className="py-[10px] w-full"
                        type="submit"
                        label="common.submit"
                    />
                </ModalFooter>
            )}
        </form>
    );
}
