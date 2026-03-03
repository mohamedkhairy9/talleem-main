import React, { useMemo, useState } from 'react';
import Modal from '@/components/common/form/Modal';
import ModalHeader from '@/components/common/form/ModalHeader';
import FormParent from './FormParent';
import { useParentQuery } from '@/api/hooks/useParents';
import { useRemoveStudentFromParentMutation } from '@/api/hooks/useParents';
import { useKinshipsQuery } from '@/api/hooks/useKinships';
import useLocale from '@/utils/hooks/global/useLocale';
import Btn from '@/components/common/buttons/Btn';
import i18next from 'i18next';

export default function ViewParent({ onClose, oldData }) {
    const { t } = useLocale();
    const [removingId, setRemovingId] = useState(null);
    const { data: parentData } = useParentQuery(oldData?.id, {
        enabled: !!oldData?.id
    });
    const { data: kinshipsData } = useKinshipsQuery({ per_page: 0 }, { enabled: true });
    const { mutate: removeStudent } = useRemoveStudentFromParentMutation();

    const parent = parentData?.data ?? oldData;
    const students = parent?.students ?? [];

    const kinshipNameById = useMemo(() => {
        const list = kinshipsData?.data ?? [];
        const lang = i18next.language;
        return list.reduce((acc, k) => {
            const name = typeof k?.name === 'object' ? k.name?.[lang] ?? k.name?.en ?? k.name?.ar : k?.name;
            acc[k?.id] = name ?? '';
            return acc;
        }, {});
    }, [kinshipsData?.data]);

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
                            const kinshipId = student?.kinship ?? student?.kinship_id;
                            const kinshipName = kinshipId != null ? kinshipNameById[kinshipId] : '';
                            return (
                                <li
                                    key={studentId}
                                    className="flex items-center justify-between px-4 py-2"
                                >
                                    <dev className="text-gray-800 gap-2">
                                        <span className='me-2'>{studentName ?? `#${studentId}`}</span>
                                        {kinshipName && (
                                            <span className="text-gray-500 text-sm ml-2">
                                                ({kinshipName})
                                            </span>
                                        )}
                                    </dev>
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
