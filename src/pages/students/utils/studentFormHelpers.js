import { isFieldRequired } from '@/utils/helpers/schemaHelpers';
import i18next from 'i18next';
import { withEntityAssignmentPayload } from '@/utils/helpers/entityAssignmentPayload';

// Helper to check if field is conditionally required
export const getIsConditionallyRequired = (field, mainProgramId, schema) => {
    if (!field.requiredWhen) return isFieldRequired(schema, field.name);
    
    const { main_program_id: requiredMainProgram } = field.requiredWhen;
    if (requiredMainProgram !== undefined) {
        if (Array.isArray(requiredMainProgram)) {
            return requiredMainProgram.includes(Number(mainProgramId));
        }
        return Number(mainProgramId) === requiredMainProgram;
    }
    
    return isFieldRequired(schema, field.name);
};

// Get display value for category (educational_entity_classification)
export const getCategoryDisplayValue = (selectedEntityEducationType, educationEntityTypeInfo) => {
    const lang = i18next.language;
    const classification = selectedEntityEducationType?.educational_entity_classification ||
        educationEntityTypeInfo.classification;

    if (!classification) return '';

    return classification[lang] || classification.en || classification.ar || '';
};

// Filter fields for main section (exclude parent fields)
export const filterMainFields = (fields, editMode, viewMode, mainProgramId) => {
    return fields.filter(field => {
        if (field.section === 'parent') return false;
        
        const modeMatch =
            (editMode && field.editMode) ||
            (viewMode && field.viewMode) ||
            (!editMode && !viewMode);

        if (!modeMatch) return false;

        if (field.conditional && field.showWhen) {
            const condition = field.showWhen.main_program_id;
            if (condition !== undefined) {
                if (Array.isArray(condition)) {
                    if (!condition.includes(Number(mainProgramId))) {
                        return false;
                    }
                } else if (Number(mainProgramId) !== condition) {
                    return false;
                }
            }
        }

        return true;
    });
};

// Filter parent fields
export const filterParentFields = (fields, editMode, viewMode) => {
    return fields.filter(field => {
        if (field.section !== 'parent') return false;
        
        return (editMode && field.editMode) ||
               (viewMode && field.viewMode) ||
               (!editMode && !viewMode);
    });
};

// Prepare submission data
export const prepareSubmissionData = (data, editMode, profileImageChanged) => {
    const {
        education_program_entity_type_classification: _classificationHelper,
        memorization_program_entity_type: _memEntityTypeHelper,
        ...submitData
    } = data;

    // In edit mode, if profile picture not changed, don't send it
    if (editMode && !profileImageChanged) {
        delete submitData.profile_picture;
    }

    // In edit mode, filter out file fields that are links (not File objects)
    if (editMode && submitData.files) {
        const fileArray = Array.isArray(submitData.files) 
            ? submitData.files 
            : [submitData.files];
        
        const actualFiles = fileArray.filter(file => file instanceof File);
        
        if (actualFiles.length > 0) {
            submitData.files = actualFiles;
        } else {
            delete submitData.files;
        }
    }

    // entity_id is derived from the selected entity_ids so it always matches the primary selection.
    delete submitData.entity_id;

    const finalData = withEntityAssignmentPayload({
        ...submitData,
        status: submitData.status ? 1 : 0,
    });

    // For education program, set education_program_entity_type_id from entity_category_id
    if (Number(submitData.main_program_id) === 1) {
        finalData.education_program_entity_type_id = submitData.entity_category_id;
    }

    return finalData;
};

