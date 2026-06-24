import React, { useMemo } from 'react';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import ModalContent from '@/components/common/form/ModalContent';
import ModalFooter from '@/components/common/form/ModalFooter';
import useRFH from '@/utils/hooks/global/useRFH';
import { assignStudentToParentSchema as schema } from '@/utils/yup/parents.schemas';
import InputRFH from '@/components/common/inputs/InputRFH';
import Btn from '@/components/common/buttons/Btn';
import { getNestedError } from '@/utils/helpers/getNestedError';
import { useAssignStudentToParentMutation } from '@/api/hooks/useParents';
import { isFieldRequired } from '@/utils/helpers/schemaHelpers';

const assignStudentFields = [
    {
        name: 'student_id',
        label: 'validation.student_id.label',
        type: 'select',
        placeholder: 'validation.student_id.placeholder'
    },
    {
        name: 'kinship_id',
        label: 'validation.kinship_id.label',
        type: 'select',
        placeholder: 'validation.kinship_id.placeholder'
    }
];

export default function AssignStudentToParent({ onClose, parentId }) {
    const { mutate, isPending } = useAssignStudentToParentMutation();

    const fieldParams = useMemo(
        () => ({
            student_id: { status: true, skipRequiredParams: true },
            kinship_id: {}
        }),
        []
    );

    const { register, errors, handleSubmit, control } = useRFH({
        schema,
        defaultValues: { student_id: '', kinship_id: '' }
    });

    function onSubmit(data) {
        const student_id =
            typeof data.student_id === 'object' && data.student_id?.id != null
                ? data.student_id.id
                : data.student_id;
        const kinship_id =
            typeof data.kinship_id === 'object' && data.kinship_id?.id != null
                ? data.kinship_id.id
                : data.kinship_id;
        mutate(
            { parentId, student_id, kinship_id },
            {
                onSuccess: () => {
                    onClose();
                }
            }
        );
    }

    return (
        <Modal size="2xl" onClose={onClose}>
            <ModalHeader header="parents.assign_student" onClose={onClose} />
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
                <ModalContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {assignStudentFields.map(field => (
                            <div key={field.name}>
                                <InputRFH
                                    p="px-3 py-3"
                                    control={control}
                                    register={register}
                                    error={getNestedError(errors, field.name)}
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    label={field.label}
                                    name={field.name}
                                    fieldParams={fieldParams}
                                    required={isFieldRequired(schema, field.name)}
                                />
                            </div>
                        ))}
                    </div>
                </ModalContent>
                <ModalFooter>
                    <Btn
                        loading={isPending}
                        className="py-[10px] w-full"
                        type="submit"
                        label="common.submit"
                    />
                </ModalFooter>
            </form>
        </Modal>
    );
}
