import React, { useState } from 'react';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import FormParent from './FormParent';
import { useParentQuery } from '@/api/hooks/useParents';
import { useRemoveStudentFromParentMutation } from '@/api/hooks/useParents';
import useLocale from '@/utils/hooks/global/useLocale';
import Btn from '@/components/common/buttons/Btn';
import i18next from 'i18next';

export default function ViewParent({ onClose, oldData }) {
    const { t } = useLocale();
    const [removingId, setRemovingId] = useState(null);
    const { data: parentData } = useParentQuery(oldData?.id, {
        enabled: !!oldData?.id
    });
    const { mutate: removeStudent } = useRemoveStudentFromParentMutation();

    const parent = parentData?.data ?? oldData;
    const students = parent?.students ?? [];

    function handleRemoveStudent(studentId) {
        if (!parent?.id || !studentId) return;
        setRemovingId(studentId);
        removeStudent(
            { parentId: parent.id, student_id: studentId },
            {
                onSettled: () => setRemovingId(null)
            }
        );
    }

    return (
        <Modal size="2xl" onClose={onClose}>
            <ModalHeader header="parents.view" onClose={onClose} />
            <FormParent
                onClose={onClose}
                oldData={parent}
                viewMode={true}
                mutate={() => {}}
                isPending={false}
                options={{}}
            />
            {Array.isArray(students) && students.length > 0 && (
                <div className="px-6 pb-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                        {t('parents.assigned_students') || 'Assigned students'}
                    </h3>
                    <ul className="space-y-2 border border-gray-200 rounded-lg divide-y divide-gray-200">
                        {students.map(student => {
                            const studentId = student?.student_id;
                            const studentName =
                                typeof student?.student_name === 'object'
                                    ? student.student_name?.[i18next.language] ?? student.student_name?.en ?? student.student_name?.ar
                                    : student?.student_name;
                            return (
                                <li
                                    key={studentId}
                                    className="flex items-center justify-between px-4 py-2"
                                >
                                    <span className="text-gray-800">
                                        {studentName ?? `#${studentId}`}
                                    </span>
                                    <Btn
                                        type="button"
                                        className="py-1.5 px-3 text-sm bg-red-600 hover:bg-red-700 text-white"
                                        loading={removingId === studentId}
                                        disabled={removingId !== null}
                                        label="common.remove"
                                        onClick={() => handleRemoveStudent(studentId)}
                                    />
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </Modal>
    );
}
