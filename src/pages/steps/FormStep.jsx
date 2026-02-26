import useRFH from '@/utils/hooks/global/useRFH';
import { createStepSchema as schema } from '@/utils/yup/steps.schemas';
import React, { useEffect, useMemo } from 'react';
import { stepsFields } from './configs';
import InputRFH from '@/components/common/inputs/InputRFH';
import Btn from '@/components/common/buttons/Btn';
import { getNestedError } from '@/utils/helpers/getNestedError';
import { generateOptions } from '@/utils/helpers/global.fns';
import { isFieldRequired } from '@/utils/helpers/schemaHelpers';
import ModalContent from '@/components/common/form/ModalContent';
import ModalFooter from '@/components/common/form/ModalFooter';
import { useUsersQuery } from '@/api/hooks/useUsers';
import { useRolesQuery } from '@/api/hooks/useRoles';

export default function FormStep({
    onClose,
    oldData,
    editMode,
    viewMode,
    isPending,
    mutate,
    options,
    onStepCreated
}) {
    // Convert status from number (1/0) to boolean (true/false) for form display
    // Also handle custom file names - if required_files contains a value that's not in predefined options,
    // treat it as a custom file name and set it up for editing
    const normalizedOldData = useMemo(() => {
        if (!oldData) return oldData;
        const normalized = {
            ...oldData,
            status: oldData.status === 1 || oldData.status === true ? true : false
        };
        
        // --- config: custom file names in required_files (commented out) ---
        // if (oldData.config?.required_files) {
        //     const requiredFiles = Array.isArray(oldData.config.required_files)
        //         ? oldData.config.required_files
        //         : [oldData.config.required_files];
        //     const predefinedOptions = ['national_id_front', 'national_id_back', 'passport', 'certificate', 'photo', 'medical_report', 'other_document'];
        //     const customFile = requiredFiles.find(file => !predefinedOptions.includes(file));
        //     if (customFile) {
        //         normalized.config = {
        //             ...(normalized.config || {}),
        //             required_files: requiredFiles.map(f => f === customFile ? 'other_document' : f),
        //             custom_file_name: { en: customFile, ar: customFile }
        //         };
        //     } else if (normalized.config) {
        //         normalized.config = { ...normalized.config };
        //     }
        // }

        return normalized;
    }, [oldData]);

    const { register, errors, handleSubmit, control, watch, setValue } = useRFH({
        schema,
        defaultValues: normalizedOldData
    });

    // Watch assigned_to_type to determine which API to call
    const assignedToType = watch('assigned_to_type') || oldData?.assigned_to_type;
    
    // --- config: watch required_files for conditional custom_file_name (commented out) ---
    // const requiredFiles = watch('config.required_files') || normalizedOldData?.config?.required_files || [];
    // const hasOtherDocument = Array.isArray(requiredFiles)
    //     ? requiredFiles.includes('other_document')
    //     : requiredFiles === 'other_document';
    const hasOtherDocument = false;

    // Fetch users when assigned_to_type is "user" (or in view/edit mode to show selected value)
    const shouldFetchUsers = assignedToType === 'user' || (viewMode || editMode) && oldData?.assigned_to_type === 'user';
    const { data: usersData } = useUsersQuery(
        { status: true },
        { enabled: shouldFetchUsers }
    );

    // Fetch roles when assigned_to_type is "role" (or in view/edit mode to show selected value)
    const shouldFetchRoles = assignedToType === 'role' || (viewMode || editMode) && oldData?.assigned_to_type === 'role';
    const { data: rolesData } = useRolesQuery(
        { status: true },
        { enabled: shouldFetchRoles }
    );

    // Reset assigned_to_id when assigned_to_type changes (only in create/edit mode, not view mode)
    useEffect(() => {
        if (!viewMode && assignedToType && assignedToType !== oldData?.assigned_to_type) {
            setValue('assigned_to_id', '');
        }
    }, [assignedToType, oldData?.assigned_to_type, setValue, viewMode]);

    // Generate options for assigned_to_id based on assigned_to_type
    const assignedToIdOptions = useMemo(() => {
        const currentAssignedToType = assignedToType || oldData?.assigned_to_type;
        
        if (currentAssignedToType === 'user') {
            const users = usersData?.data || [];
            // In view/edit mode, ensure the selected user is included even if not in the list
            if ((viewMode || editMode) && oldData?.assigned_to_id) {
                const selectedUser = users.find(u => u.id === oldData.assigned_to_id);
                if (!selectedUser) {
                    // Add the selected user if not found in the list
                    users.unshift({ 
                        id: oldData.assigned_to_id, 
                        name: { en: `User ${oldData.assigned_to_id}`, ar: `User ${oldData.assigned_to_id}` }, 
                        email: '' 
                    });
                }
            }
            return users.map(user => {
                // Safely extract label from name object
                let label = `User ${user.id}`; // Default fallback
                
                if (user.name) {
                    if (typeof user.name === 'object' && user.name !== null) {
                        // Handle multilingual object {en: "...", ar: "..."}
                        label = user.name.en || user.name.ar || label;
                    } else if (typeof user.name === 'string') {
                        // Handle string name
                        label = user.name;
                    }
                } else if (user.email) {
                    // Fallback to email if name is not available
                    label = user.email;
                }
                
                // Ensure label is always a string (safety check)
                if (typeof label !== 'string') {
                    label = String(label) || `User ${user.id}`;
                }
                
                return {
                    label: label,
                    value: user.id
                };
            });
        } else if (currentAssignedToType === 'role') {
            // Only these roles are shown in Assigned To ID when type is "role" (exact match on role.name)
            const ALLOWED_ROLE_NAMES = new Set(['super_admin', 'entity manager', 'branch manager']);
            const allRoles = rolesData?.data || [];
            const roles = allRoles.filter(r =>
                r?.name != null && ALLOWED_ROLE_NAMES.has(String(r.name).trim())
            );
            // In view/edit mode, ensure the selected role is included even if not in the list
            if ((viewMode || editMode) && oldData?.assigned_to_id) {
                const selectedRole = roles.find(r => r.id === oldData.assigned_to_id);
                if (!selectedRole) {
                    const fullRole = allRoles.find(r => r.id === oldData.assigned_to_id);
                    if (fullRole) roles.unshift(fullRole);
                    else roles.unshift({ id: oldData.assigned_to_id, display_name: { en: `Role ${oldData.assigned_to_id}`, ar: `Role ${oldData.assigned_to_id}` } });
                }
            }
            return roles.map(role => {
                // Safely extract label from display_name object
                let label = `Role ${role.id}`; // Default fallback
                
                if (role.display_name) {
                    if (typeof role.display_name === 'object' && role.display_name !== null) {
                        // Handle multilingual object {en: "...", ar: "..."}
                        label = role.display_name.en || role.display_name.ar || label;
                    } else if (typeof role.display_name === 'string') {
                        // Handle string display_name
                        label = role.display_name;
                    }
                } else if (role.name) {
                    // Handle name field (could be string or object)
                    if (typeof role.name === 'object' && role.name !== null) {
                        label = role.name.en || role.name.ar || label;
                    } else if (typeof role.name === 'string') {
                        label = role.name;
                    }
                }
                
                // Ensure label is always a string (safety check)
                if (typeof label !== 'string') {
                    label = String(label) || `Role ${role.id}`;
                }
                
                return {
                    label: label,
                    value: role.id
                };
            });
        }
        return [];
    }, [assignedToType, usersData, rolesData, oldData, viewMode, editMode]);

    function onSubmit(data) {
        // Convert status from boolean to number (1/0) for API
        const submissionData = {
            ...data,
            status: data.status ? 1 : 0
        };
        
        // --- config: build config object for submission (commented out) ---
        // const configRequiredFiles = data.config?.required_files;
        // const configAutoApprove = data.config?.auto_approve_after_hours;
        // const configMaxUpload = data.config?.rules?.max_upload_size_mb;
        // const customFileName = data.config?.custom_file_name;
        // if (configRequiredFiles || configAutoApprove !== undefined || configMaxUpload !== undefined || customFileName) {
        //     submissionData.config = {};
        //     if (configRequiredFiles) {
        //         let filesArray = Array.isArray(configRequiredFiles) ? [...configRequiredFiles] : [configRequiredFiles].filter(Boolean);
        //         if (filesArray.includes('other_document') && customFileName) {
        //             const customNameEn = customFileName.en?.trim();
        //             const customNameAr = customFileName.ar?.trim();
        //             if (customNameEn || customNameAr) {
        //                 filesArray = filesArray.filter(f => f !== 'other_document');
        //                 const customName = customNameEn || customNameAr || 'other_document';
        //                 filesArray.push(customName);
        //             }
        //         }
        //         submissionData.config.required_files = filesArray;
        //     }
        //     if (configAutoApprove !== undefined && configAutoApprove !== null && configAutoApprove !== '') {
        //         submissionData.config.auto_approve_after_hours = Number(configAutoApprove);
        //     }
        //     if (configMaxUpload !== undefined && configMaxUpload !== null && configMaxUpload !== '') {
        //         submissionData.config.rules = { max_upload_size_mb: Number(configMaxUpload) };
        //     }
        // } else {
        //     delete submissionData.config;
        // }
        if (data.config) delete submissionData.config;

        if (editMode && oldData?.id) {
            submissionData.id = oldData.id;
        }
        
        mutate(submissionData, {
            onSuccess: () => {
                onClose();
                // Call onStepCreated callback if provided (for CreateStep)
                if (onStepCreated) {
                    onStepCreated();
                }
            }
        });
    }

    // --- config: options for required_files (commented out) ---
    // const requiredFilesOptions = useMemo(() => [
    //     { label: 'National ID Front', value: 'national_id_front' },
    //     { label: 'National ID Back', value: 'national_id_back' },
    //     { label: 'Passport', value: 'passport' },
    //     { label: 'Certificate', value: 'certificate' },
    //     { label: 'Photo', value: 'photo' },
    //     { label: 'Medical Report', value: 'medical_report' },
    //     { label: 'Other Document', value: 'other_document' }
    // ], []);

    // Helper to get options for a field
    const getFieldOptions = (fieldName) => {
        if (fieldName === 'assigned_to_id') {
            return generateOptions(assignedToIdOptions);
        }
        // if (fieldName === 'config.required_files') {
        //     return generateOptions(requiredFilesOptions);
        // }
        return generateOptions(options?.[fieldName]);
    };

    // Helper to check if field should be disabled
    const isFieldDisabled = (fieldName) => {
        if (viewMode) return true;
        if (fieldName === 'assigned_to_id' && !assignedToType) {
            return true;
        }
        return false;
    };

    // Filter fields based on conditional logic
    const filteredFields = stepsFields.filter(field => {
        // Check edit/view mode
        const modeMatch =
            (editMode && field.editMode) ||
            (viewMode && field.viewMode) ||
            (!editMode && !viewMode);

        if (!modeMatch) return false;

        // Check conditional fields
        if (field.conditional && field.showWhen) {
            if (field.showWhen.hasOtherDocument !== undefined) {
                return hasOtherDocument === field.showWhen.hasOtherDocument;
            }
        }

        return true;
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
            <ModalContent>
                <div className="space-y-2">
                    {filteredFields.map(field => {
                        // Handle nested field default values (e.g., config.required_files, config.rules.max_upload_size_mb)
                        const getDefaultValue = () => {
                            if (field.defaultValue !== undefined) {
                                return field.defaultValue;
                            }
                            if (field.name.includes('.')) {
                                return field.name.split('.').reduce((obj, key) => obj?.[key], normalizedOldData);
                            }
                            return normalizedOldData?.[field.name];
                        };

                        return (
                            <InputRFH
                                p="px-3 py-3"
                                control={control}
                                register={register}
                                error={getNestedError(errors, field.name)}
                                key={field.name}
                                type={field.type}
                                placeholder={field.placeholder}
                                label={field.label}
                                name={field.name}
                                disabled={isFieldDisabled(field.name)}
                                defaultValue={getDefaultValue()}
                                options={getFieldOptions(field.name)}
                                isMulti={field.isMulti}
                                required={isFieldRequired(schema, field.name)}
                            />
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

